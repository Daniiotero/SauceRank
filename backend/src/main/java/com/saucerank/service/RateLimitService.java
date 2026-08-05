package com.saucerank.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final ConcurrentHashMap<String, Deque<Long>> requests = new ConcurrentHashMap<>();
    private final long limit;
    private final long windowMs;
    private final Clock clock;

    public RateLimitService(@Value("${app.security.rate-limit.max-per-window:10}") long limit,
                            @Value("${app.security.rate-limit.window-minutes:15}") long windowMinutes,
                            Clock clock) {
        this.limit = limit;
        this.windowMs = windowMinutes * 60_000L;
        this.clock = clock;
    }

    public boolean isAllowed(String key) {
        long now = clock.millis();
        Deque<Long> deque = requests.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (deque) {
            while (!deque.isEmpty() && deque.peekFirst() <= now - windowMs) {
                deque.pollFirst();
            }
            if (deque.size() >= limit) {
                return false;
            }
            deque.addLast(now);
            return true;
        }
    }
}

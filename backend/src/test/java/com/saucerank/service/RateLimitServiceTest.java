package com.saucerank.service;

import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RateLimitServiceTest {

    private final MutableClock clock = new MutableClock();

    private RateLimitService service(long limit, long windowMinutes) {
        return new RateLimitService(limit, windowMinutes, clock);
    }

    @Test
    void permiteHastaElLimiteYBloqueaDespues() {
        RateLimitService service = service(3, 15);

        assertTrue(service.isAllowed("192.168.1.1"));
        assertTrue(service.isAllowed("192.168.1.1"));
        assertTrue(service.isAllowed("192.168.1.1"));
        assertFalse(service.isAllowed("192.168.1.1"));
    }

    @Test
    void laVentanaDeslizanteDejaPasarCuandoExpiroElTiempo() {
        RateLimitService service = service(2, 1);

        assertTrue(service.isAllowed("ip"));
        assertTrue(service.isAllowed("ip"));
        assertFalse(service.isAllowed("ip"));

        clock.advance(java.time.Duration.ofMinutes(2));

        assertTrue(service.isAllowed("ip"));
    }

    @Test
    void lasIpsSonIndependientes() {
        RateLimitService service = service(1, 15);

        assertTrue(service.isAllowed("ip-a"));
        assertFalse(service.isAllowed("ip-a"));
        assertTrue(service.isAllowed("ip-b"));
    }

    private static class MutableClock extends Clock {
        private Instant now = Instant.parse("2026-01-01T00:00:00Z");

        void advance(java.time.Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public Instant instant() { return now; }

        @Override
        public ZoneId getZone() { return ZoneId.of("UTC"); }

        @Override
        public Clock withZone(ZoneId zone) { return this; }
    }
}

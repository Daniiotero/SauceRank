package com.saucerank.service;

import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int[] LOCK_THRESHOLDS = {5, 10, 15};
    private static final long[] LOCK_MINUTES = {5, 15, 30};

    private final ConcurrentHashMap<String, Attempt> attempts = new ConcurrentHashMap<>();
    private final MailService mailService;
    private final Clock clock;

    public LoginAttemptService(MailService mailService, Clock clock) {
        this.mailService = mailService;
        this.clock = clock;
    }

    public synchronized boolean isLocked(String username) {
        Attempt attempt = attempts.get(username);
        return attempt != null && attempt.lockedUntil != null && attempt.lockedUntil.isAfter(clock.instant());
    }

    public synchronized long getRemainingLockoutSeconds(String username) {
        Attempt attempt = attempts.get(username);
        if (attempt == null || attempt.lockedUntil == null) {
            return 0;
        }
        long seconds = Duration.between(clock.instant(), attempt.lockedUntil).getSeconds();
        return Math.max(0, seconds);
    }

    public synchronized void registerFailure(String username, String email) {
        Attempt attempt = attempts.computeIfAbsent(username, k -> new Attempt());
        boolean alreadyLocked = attempt.lockedUntil != null && attempt.lockedUntil.isAfter(clock.instant());

        attempt.count++;
        long lockMinutes = lockoutMinutesFor(attempt.count);
        if (lockMinutes > 0) {
            boolean newLockoutEpisode = !alreadyLocked;
            attempt.lockedUntil = clock.instant().plus(Duration.ofMinutes(lockMinutes));
            if (newLockoutEpisode) {
                mailService.send(email,
                        "Tu cuenta fue temporalmente bloqueada",
                        "Hola " + username + "!\n\n"
                                + "Se detectaron varios intentos fallidos de inicio de sesión en tu cuenta.\n"
                                + "Por seguridad, quedó bloqueada temporalmente por " + lockMinutes + " minutos.\n"
                                + "Si fuiste vos, esperá ese tiempo e intentá de nuevo.\n"
                                + "Si no fuiste vos, te recomendamos cambiar tu contraseña cuando vuelvas a entrar.");
            }
        }
    }

    public synchronized void registerSuccess(String username) {
        attempts.remove(username);
    }

    private long lockoutMinutesFor(int count) {
        for (int i = LOCK_THRESHOLDS.length - 1; i >= 0; i--) {
            if (count >= LOCK_THRESHOLDS[i]) {
                return LOCK_MINUTES[i];
            }
        }
        return 0;
    }

    private static class Attempt {
        int count;
        Instant lockedUntil;
    }
}

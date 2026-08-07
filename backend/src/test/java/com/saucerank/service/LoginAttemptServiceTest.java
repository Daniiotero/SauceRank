package com.saucerank.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class LoginAttemptServiceTest {

    @Mock
    private MailService mailService;

    private final MutableClock clock = new MutableClock();

    private LoginAttemptService service() {
        return new LoginAttemptService(mailService, clock);
    }

    @Test
    void bloqueaTrasCincoIntentosFallidosPorCincoMinutos() {
        LoginAttemptService service = service();

        for (int i = 0; i < 4; i++) {
            service.registerFailure("sauce", "sauce@example.com");
            assertFalse(service.isLocked("sauce"));
        }

        service.registerFailure("sauce", "sauce@example.com");
        assertTrue(service.isLocked("sauce"));
        long remaining = service.getRemainingLockoutSeconds("sauce");
        assertTrue(remaining > 4 * 60 && remaining <= 5 * 60);
        verify(mailService).send(eq("sauce@example.com"), eq("Tu cuenta ha sido bloqueada temporalmente"),
                contains("5 minutos"));
    }

    @Test
    void escalaProgresivamenteElBloqueoTrasNuevosFracasos() {
        LoginAttemptService service = service();

        for (int i = 0; i < 5; i++) {
            service.registerFailure("sauce", "sauce@example.com");
        }
        assertTrue(service.getRemainingLockoutSeconds("sauce") <= 5 * 60);

        clock.advance(Duration.ofMinutes(6));
        assertFalse(service.isLocked("sauce"));

        for (int i = 0; i < 5; i++) {
            service.registerFailure("sauce", "sauce@example.com");
        }
        assertTrue(service.isLocked("sauce"));
        long remaining = service.getRemainingLockoutSeconds("sauce");
        assertTrue(remaining > 14 * 60 && remaining <= 15 * 60);
    }

    @Test
    void noEnviaNotificacionHastaAlcanzarElUmbral() {
        LoginAttemptService service = service();

        for (int i = 0; i < 4; i++) {
            service.registerFailure("sauce", "sauce@example.com");
        }

        verify(mailService, never()).send(any(), any(), any());
    }

    @Test
    void losFracasosDuranteUnBloqueoExtiendenElBloqueoPeroNoReenvianCorreo() {
        LoginAttemptService service = service();

        for (int i = 0; i < 5; i++) {
            service.registerFailure("sauce", "sauce@example.com");
        }
        for (int i = 0; i < 5; i++) {
            service.registerFailure("sauce", "sauce@example.com");
        }

        assertTrue(service.getRemainingLockoutSeconds("sauce") <= 15 * 60);
        verify(mailService).send(eq("sauce@example.com"), any(), any());
    }

    @Test
    void elLoginExitosoLimpiaLosIntentosFallidos() {
        LoginAttemptService service = service();

        for (int i = 0; i < 3; i++) {
            service.registerFailure("sauce", "sauce@example.com");
        }
        service.registerSuccess("sauce");

        assertFalse(service.isLocked("sauce"));
        service.registerFailure("sauce", "sauce@example.com");
        assertFalse(service.isLocked("sauce"));
    }

    @Test
    void tambienBloqueaUsuariosInexistentes() {
        LoginAttemptService service = service();

        for (int i = 0; i < 5; i++) {
            service.registerFailure("usuario-fantasma", null);
        }

        assertTrue(service.isLocked("usuario-fantasma"));
    }

    private static class MutableClock extends Clock {
        private Instant now = Instant.parse("2026-01-01T00:00:00Z");

        void advance(Duration duration) {
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

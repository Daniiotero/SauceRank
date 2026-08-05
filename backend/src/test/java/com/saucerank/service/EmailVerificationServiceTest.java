package com.saucerank.service;

import com.saucerank.errors.ApiException;
import com.saucerank.model.EmailVerificationToken;
import com.saucerank.model.User;
import com.saucerank.repository.EmailVerificationTokenRepository;
import com.saucerank.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmailVerificationServiceTest {

    @Mock
    private EmailVerificationTokenRepository tokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MailService mailService;

    private EmailVerificationService service() {
        return new EmailVerificationService(tokenRepository, userRepository, mailService,
                "http://localhost:5173");
    }

    @Test
    void createAndSendVerificationGuardaTokenHashConVencimientoDe24Horas() {
        EmailVerificationService service = service();
        User user = new User("sauce", "sauce@example.com", "hashed");

        service.createAndSendVerification(user);

        ArgumentCaptor<EmailVerificationToken> captor = ArgumentCaptor.forClass(EmailVerificationToken.class);
        verify(tokenRepository).save(captor.capture());
        EmailVerificationToken saved = captor.getValue();
        assertEquals(user, saved.getUser());
        assertNotNull(saved.getTokenHash());
        assertEquals(64, saved.getTokenHash().length());
        assertTrue(saved.getExpiresAt().isAfter(LocalDateTime.now().plusHours(23)));
        assertTrue(saved.getExpiresAt().isBefore(LocalDateTime.now().plusHours(25)));
    }

    @Test
    void verifyActivaLaCuentaYBorraElToken() {
        EmailVerificationService service = service();
        User user = new User("sauce", "sauce@example.com", "hashed");
        user.setId(1L);
        String token = "abc123";
        EmailVerificationToken verification =
                new EmailVerificationToken(user, sha256(token), LocalDateTime.now().plusHours(24));
        when(tokenRepository.findByTokenHash(sha256(token))).thenReturn(Optional.of(verification));

        service.verify(token);

        assertTrue(user.isEnabled());
        verify(userRepository).save(user);
        verify(tokenRepository).delete(verification);
    }

    @Test
    void verifyRechazaTokenDesconocido() {
        EmailVerificationService service = service();
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.empty());

        assertThrows(ApiException.class, () -> service.verify("no-existe"));
    }

    @Test
    void verifyRechazaTokenExpirado() {
        EmailVerificationService service = service();
        User user = new User("sauce", "sauce@example.com", "hashed");
        EmailVerificationToken verification =
                new EmailVerificationToken(user, sha256("token"), LocalDateTime.now().minusHours(1));
        when(tokenRepository.findByTokenHash(sha256("token"))).thenReturn(Optional.of(verification));

        assertThrows(ApiException.class, () -> service.verify("token"));
        verify(userRepository, never()).save(any());
    }

    @Test
    void verifyRechazaTokenYaUsado() {
        EmailVerificationService service = service();
        User user = new User("sauce", "sauce@example.com", "hashed");
        EmailVerificationToken verification =
                new EmailVerificationToken(user, sha256("token"), LocalDateTime.now().plusHours(24));
        verification.setUsedAt(LocalDateTime.now());
        when(tokenRepository.findByTokenHash(sha256("token"))).thenReturn(Optional.of(verification));

        assertThrows(ApiException.class, () -> service.verify("token"));
        verify(userRepository, never()).save(any());
    }

    @Test
    void verifyRechazaTokenNuloOVacio() {
        EmailVerificationService service = service();

        assertThrows(ApiException.class, () -> service.verify(null));
        assertThrows(ApiException.class, () -> service.verify("  "));
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}

package com.saucerank.service;

import com.saucerank.errors.ApiException;
import com.saucerank.model.EmailVerificationToken;
import com.saucerank.model.User;
import com.saucerank.repository.EmailVerificationTokenRepository;
import com.saucerank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class EmailVerificationService {

    private static final int TOKEN_LIFETIME_HOURS = 24;
    private static final String INVALID_LINK_MESSAGE = "El enlace de verificación es inválido o expiró";

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final String frontendUrl;
    private final SecureRandom secureRandom = new SecureRandom();

    public EmailVerificationService(EmailVerificationTokenRepository tokenRepository,
                                    UserRepository userRepository,
                                    MailService mailService,
                                    @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.frontendUrl = frontendUrl;
    }

    public void createAndSendVerification(User user) {
        String token = generateToken();
        String tokenHash = sha256Hex(token);
        tokenRepository.save(new EmailVerificationToken(user, tokenHash, LocalDateTime.now().plusHours(TOKEN_LIFETIME_HOURS)));
        sendVerificationEmail(user, token);
    }

    public void verify(String token) {
        if (token == null || token.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, INVALID_LINK_MESSAGE);
        }

        EmailVerificationToken verification = tokenRepository.findByTokenHash(sha256Hex(token))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, INVALID_LINK_MESSAGE));

        if (verification.isUsed() || verification.isExpired()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, INVALID_LINK_MESSAGE);
        }

        User user = verification.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        tokenRepository.delete(verification);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private void sendVerificationEmail(User user, String token) {
        String url = frontendUrl + "/verify-email?token=" + token;
        mailService.send(user.getEmail(),
                "Activá tu cuenta en SauceRank",
                "Hola " + user.getUsername() + "!\n\n"
                        + "Para activar tu cuenta hacé clic en este enlace (válido por 24 horas):\n"
                        + url + "\n\n"
                        + "Si no te registraste en SauceRank, podés ignorar este correo.");
    }

    private String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}

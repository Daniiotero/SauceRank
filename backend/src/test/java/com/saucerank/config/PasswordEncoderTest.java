package com.saucerank.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordEncoderTest {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @Test
    void hashUsaBcryptConCosteDiez() {
        String hash = passwordEncoder.encode("secret12");
        assertTrue(hash.startsWith("$2a$10$"), "El hash debe ser bcrypt con coste 10");
    }

    @Test
    void usaSaltUnicoPorUsuario() {
        String hash1 = passwordEncoder.encode("secret12");
        String hash2 = passwordEncoder.encode("secret12");
        assertNotEquals(hash1, hash2);
    }

    @Test
    void elHashNoEsReversible() {
        String hash = passwordEncoder.encode("secret12");
        assertFalse(hash.contains("secret12"));
    }

    @Test
    void verificaPasswordCorrecta() {
        String hash = passwordEncoder.encode("secret12");
        assertTrue(passwordEncoder.matches("secret12", hash));
        assertFalse(passwordEncoder.matches("otra-password", hash));
    }
}

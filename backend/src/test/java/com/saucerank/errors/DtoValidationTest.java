package com.saucerank.errors;

import com.saucerank.dto.LoginRequest;
import com.saucerank.dto.RegisterRequest;
import com.saucerank.dto.VoteRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DtoValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private RegisterRequest validRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("sauce");
        request.setEmail("sauce@example.com");
        request.setPassword("secret12");
        return request;
    }

    @Test
    void registerRequestAceptaDatosValidos() {
        assertTrue(validator.validate(validRegisterRequest()).isEmpty());
    }

    @Test
    void registerRequestRechazaPasswordCorta() {
        RegisterRequest request = validRegisterRequest();
        request.setPassword("123");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    void registerRequestRechazaPasswordDeMasDe64Caracteres() {
        RegisterRequest request = validRegisterRequest();
        request.setPassword("a".repeat(65));

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    void registerRequestRechazaUsernameConCaracteresInvalidos() {
        RegisterRequest request = validRegisterRequest();
        request.setUsername("sau ce!");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @Test
    void registerRequestRechazaEmailInvalido() {
        RegisterRequest request = validRegisterRequest();
        request.setEmail("no-es-un-email");

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    void loginRequestRechazaUsernameVacio() {
        LoginRequest request = new LoginRequest();
        request.setUsername("   ");
        request.setPassword("secret1");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @Test
    void voteRequestRechazaScoreFueraDeRango() {
        VoteRequest request = new VoteRequest();
        request.setSongId(1L);
        request.setScore(11);

        Set<ConstraintViolation<VoteRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("score")));
    }

    @Test
    void voteRequestRechazaScoreYCancionNulos() {
        VoteRequest request = new VoteRequest();

        Set<ConstraintViolation<VoteRequest>> violations = validator.validate(request);

        assertEquals(2, violations.size());
    }
}

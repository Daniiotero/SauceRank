package com.saucerank.errors;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleBodyValidationDevuelve400ConErroresPorCampo() {
        org.springframework.validation.BindingResult bindingResult = mock(org.springframework.validation.BindingResult.class);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(
                new FieldError("registerRequest", "password", "La contraseña debe tener al menos 6 caracteres")));
        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(null, bindingResult);

        ResponseEntity<ApiErrorResponse> response = handler.handleBodyValidation(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Datos no válidos", response.getBody().getError());
        assertEquals("La contraseña debe tener al menos 6 caracteres",
                response.getBody().getFieldErrors().get("password"));
    }

    @Test
    void handleApiExceptionDevuelveElStatusYElMensaje() {
        ApiException ex = new ApiException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");

        ResponseEntity<ApiErrorResponse> response = handler.handleApiException(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Usuario o contraseña incorrectos", response.getBody().getError());
    }

    @Test
    void handleUnreadableBodyDevuelve400() {
        HttpMessageNotReadableException ex = new HttpMessageNotReadableException("cuerpo inválido");

        ResponseEntity<ApiErrorResponse> response = handler.handleUnreadableBody(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Solicitud no válida", response.getBody().getError());
    }

    @Test
    void handleTypeMismatchDevuelve400() {
        MethodArgumentTypeMismatchException ex =
                new MethodArgumentTypeMismatchException("abc", Long.class, "songId", null, null);

        ResponseEntity<ApiErrorResponse> response = handler.handleTypeMismatch(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().getMessage().contains("abc"));
    }

    @Test
    void handleMissingParameterDevuelve400() {
        MissingServletRequestParameterException ex =
                new MissingServletRequestParameterException("q", "String");

        ResponseEntity<ApiErrorResponse> response = handler.handleMissingParameter(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().getMessage().contains("q"));
    }

    @Test
    void handleGenericDevuelve500SinExponerElError() {
        ResponseEntity<ApiErrorResponse> response = handler.handleGeneric(new RuntimeException("secreto interno"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Ha ocurrido un error inesperado", response.getBody().getMessage());
    }
}

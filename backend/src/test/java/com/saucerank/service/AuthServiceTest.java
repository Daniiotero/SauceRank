package com.saucerank.service;

import com.saucerank.config.JwtUtil;
import com.saucerank.dto.AuthResponse;
import com.saucerank.dto.LoginRequest;
import com.saucerank.dto.MessageResponse;
import com.saucerank.dto.RegisterRequest;
import com.saucerank.errors.ApiException;
import com.saucerank.model.User;
import com.saucerank.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

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
class AuthServiceTest {

    private static final String NEUTRAL_REGISTER_MESSAGE = "Cuenta creada correctamente";

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private BreachedPasswordService breachedPasswordService;

    @Mock
    private LoginAttemptService loginAttemptService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest(String username, String email, String password) {
        RegisterRequest request = new RegisterRequest();
        request.setUsername(username);
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    private LoginRequest loginRequest(String username, String password) {
        LoginRequest request = new LoginRequest();
        request.setUsername(username);
        request.setPassword(password);
        return request;
    }

    private User verifiedUser(long id, String username, String passwordHash) {
        User user = new User(username, username + "@example.com", passwordHash);
        user.setId(id);
        return user;
    }

    private void stubSuccessfulRegistration() {
        when(userRepository.existsByUsername("sauce")).thenReturn(false);
        when(userRepository.existsByEmail("sauce@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret12")).thenReturn("hashed");
        User saved = new User("sauce", "sauce@example.com", "hashed");
        saved.setId(1L);
        when(userRepository.save(any(User.class))).thenReturn(saved);
    }

    @Test
    void registerCreaUsuarioYNoGeneraToken() {
        stubSuccessfulRegistration();

        MessageResponse response = authService.register(registerRequest("sauce", "sauce@example.com", "secret12"));

        assertEquals(NEUTRAL_REGISTER_MESSAGE, response.getMessage());
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("sauce", captor.getValue().getUsername());
        verify(jwtUtil, never()).generateToken(any(), any());
    }

    @Test
    void registerConUsernameDuplicadoDevuelveMensajeNeutroYNoCrea() {
        when(userRepository.existsByUsername("sauce")).thenReturn(true);

        MessageResponse response = authService.register(registerRequest("sauce", "sauce@example.com", "secret12"));

        assertEquals(NEUTRAL_REGISTER_MESSAGE, response.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerConEmailDuplicadoDevuelveMensajeNeutroYNoCrea() {
        when(userRepository.existsByUsername("sauce")).thenReturn(false);
        when(userRepository.existsByEmail("sauce@example.com")).thenReturn(true);

        MessageResponse response = authService.register(registerRequest("sauce", "sauce@example.com", "secret12"));

        assertEquals(NEUTRAL_REGISTER_MESSAGE, response.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerSanitizaYRecortaUsernameYEmail() {
        stubSuccessfulRegistration();

        authService.register(registerRequest("  sauce  ", "  sauce@example.com  ", "secret12"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("sauce", captor.getValue().getUsername());
        assertEquals("sauce@example.com", captor.getValue().getEmail());
    }

    @Test
    void registerRechazaUsernameConCaracteresInvalidos() {
        assertThrows(ApiException.class,
                () -> authService.register(registerRequest("sau ce!", "sauce@example.com", "secret1")));
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerRechazaPasswordDemasiadoCorta() {
        assertThrows(ApiException.class,
                () -> authService.register(registerRequest("sauce", "sauce@example.com", "123")));
    }

    @Test
    void registerRechazaPasswordDemasiadoLarga() {
        assertThrows(ApiException.class,
                () -> authService.register(registerRequest("sauce", "sauce@example.com", "a".repeat(65))));
    }

    @Test
    void registerRechazaPasswordAparecidaEnFiltraciones() {
        when(breachedPasswordService.isBreached("secret12")).thenReturn(true);

        assertThrows(ApiException.class,
                () -> authService.register(registerRequest("sauce", "sauce@example.com", "secret12")));

        verify(userRepository, never()).save(any());
    }

    @Test
    void registerPermitePasswordNoFiltrada() {
        when(breachedPasswordService.isBreached("secret12")).thenReturn(false);
        stubSuccessfulRegistration();

        MessageResponse response = authService.register(registerRequest("sauce", "sauce@example.com", "secret12"));

        assertNotNull(response);
        assertEquals(NEUTRAL_REGISTER_MESSAGE, response.getMessage());
    }

    @Test
    void loginDevuelveTokenConCredencialesCorrectas() {
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.of(verifiedUser(1L, "sauce", "hashed")));
        when(passwordEncoder.matches("secret1", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(1L, "sauce")).thenReturn("jwt-token");

        AuthResponse response = authService.login(loginRequest("sauce", "secret1"));

        assertEquals("jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("sauce", response.getUsername());
    }

    @Test
    void loginLanzaSiLaPasswordEsIncorrecta() {
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.of(verifiedUser(1L, "sauce", "hashed")));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        ApiException ex = assertThrows(ApiException.class,
                () -> authService.login(loginRequest("sauce", "wrong")));
        assertEquals("Usuario o contraseña incorrectos", ex.getMessage());
    }

    @Test
    void loginLanzaSiElUsuarioNoExiste() {
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class,
                () -> authService.login(loginRequest("sauce", "secret1")));
        assertEquals("Usuario o contraseña incorrectos", ex.getMessage());
        verify(passwordEncoder).matches("secret1", null);
        verify(loginAttemptService).registerFailure("sauce", null);
    }

    @Test
    void loginRegistraFalloCuandoLaPasswordEsIncorrecta() {
        User user = new User("sauce", "sauce@example.com", "hashed");
        user.setId(1L);
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(ApiException.class, () -> authService.login(loginRequest("sauce", "wrong")));
        verify(loginAttemptService).registerFailure("sauce", "sauce@example.com");
    }

    @Test
    void loginDevuelve429SiLaCuentaEstaBloqueada() {
        when(loginAttemptService.isLocked("sauce")).thenReturn(true);
        when(loginAttemptService.getRemainingLockoutSeconds("sauce")).thenReturn(300L);

        ApiException ex = assertThrows(ApiException.class,
                () -> authService.login(loginRequest("sauce", "secret1")));
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, ex.getStatus());
        assertTrue(ex.getMessage().contains("Demasiados intentos fallidos"));
        verify(userRepository, never()).findByUsername(any());
    }

    @Test
    void loginLimpiaLosIntentosFallidosAlTenerExito() {
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.of(verifiedUser(1L, "sauce", "hashed")));
        when(passwordEncoder.matches("secret1", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(1L, "sauce")).thenReturn("jwt-token");

        authService.login(loginRequest("sauce", "secret1"));

        verify(loginAttemptService).registerSuccess("sauce");
    }

    @Test
    void loginRecortaElUsernameAntesDeBuscar() {
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.of(verifiedUser(1L, "sauce", "hashed")));
        when(passwordEncoder.matches("secret1", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(1L, "sauce")).thenReturn("jwt-token");

        AuthResponse response = authService.login(loginRequest("  sauce  ", "secret1"));

        verify(userRepository).findByUsername("sauce");
        assertEquals("jwt-token", response.getToken());
    }
}

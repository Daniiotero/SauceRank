package com.saucerank.service;

import com.saucerank.config.JwtUtil;
import com.saucerank.dto.AuthResponse;
import com.saucerank.dto.LoginRequest;
import com.saucerank.dto.RegisterRequest;
import com.saucerank.model.User;
import com.saucerank.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

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

    @Test
    void registerEncriptaPasswordYDevuelveToken() {
        when(userRepository.existsByUsername("sauce")).thenReturn(false);
        when(userRepository.existsByEmail("sauce@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret1")).thenReturn("hashed");

        User saved = new User("sauce", "sauce@example.com", "hashed");
        saved.setId(1L);
        when(userRepository.save(any(User.class))).thenReturn(saved);
        when(jwtUtil.generateToken(1L, "sauce")).thenReturn("jwt-token");

        AuthResponse response = authService.register(registerRequest("sauce", "sauce@example.com", "secret1"));

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("sauce", response.getUsername());
        verify(passwordEncoder).encode("secret1");
    }

    @Test
    void registerRechazaUsernameDuplicado() {
        when(userRepository.existsByUsername("sauce")).thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest("sauce", "sauce@example.com", "secret1")));

        verify(userRepository, never()).save(any());
    }

    @Test
    void registerRechazaEmailDuplicado() {
        when(userRepository.existsByUsername("sauce")).thenReturn(false);
        when(userRepository.existsByEmail("sauce@example.com")).thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest("sauce", "sauce@example.com", "secret1")));
    }

    @Test
    void loginDevuelveTokenConCredencialesCorrectas() {
        User user = new User("sauce", "sauce@example.com", "hashed");
        user.setId(1L);
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret1", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(1L, "sauce")).thenReturn("jwt-token");

        AuthResponse response = authService.login(loginRequest("sauce", "secret1"));

        assertEquals("jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("sauce", response.getUsername());
    }

    @Test
    void loginLanzaSiElUsuarioNoExiste() {
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> authService.login(loginRequest("sauce", "secret1")));
    }

    @Test
    void loginLanzaSiLaPasswordEsIncorrecta() {
        User user = new User("sauce", "sauce@example.com", "hashed");
        when(userRepository.findByUsername("sauce")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(RuntimeException.class,
                () -> authService.login(loginRequest("sauce", "wrong")));
    }
}

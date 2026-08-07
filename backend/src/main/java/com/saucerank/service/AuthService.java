package com.saucerank.service;

import com.saucerank.config.JwtUtil;
import com.saucerank.dto.AuthResponse;
import com.saucerank.dto.LoginRequest;
import com.saucerank.dto.MessageResponse;
import com.saucerank.dto.RegisterRequest;
import com.saucerank.errors.ApiException;
import com.saucerank.model.User;
import com.saucerank.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern USERNAME_PATTERN = Pattern.compile("[A-Za-z0-9_]{3,50}");
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MAX_PASSWORD_LENGTH = 64;
    private static final String NEUTRAL_LOGIN_MESSAGE = "Usuario o contraseña incorrectos";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final BreachedPasswordService breachedPasswordService;
    private final LoginAttemptService loginAttemptService;
    private final String dummyPasswordHash;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                       BreachedPasswordService breachedPasswordService,
                       LoginAttemptService loginAttemptService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.breachedPasswordService = breachedPasswordService;
        this.loginAttemptService = loginAttemptService;
        this.dummyPasswordHash = passwordEncoder.encode("saucerank-dummy-password");
    }

    public MessageResponse register(RegisterRequest request) {
        if (request == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Datos no válidos");
        }

        String username = request.getUsername() == null ? null : request.getUsername().trim();
        String email = request.getEmail() == null ? null : request.getEmail().trim();

        if (username == null || !USERNAME_PATTERN.matcher(username).matches()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "El nombre de usuario debe tener entre 3 y 50 caracteres y solo letras, números o guion bajo");
        }
        if (email == null || email.isBlank() || !email.contains("@") || email.length() > 100) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "El email no es válido");
        }
        String password = request.getPassword() == null ? null : request.getPassword();
        if (password == null || password.length() < MIN_PASSWORD_LENGTH) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 8 caracteres");
        }
        if (password.length() > MAX_PASSWORD_LENGTH) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La contraseña no puede superar los 64 caracteres");
        }
        if (breachedPasswordService.isBreached(password)) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Esta contraseña ha aparecido en una filtración conocida. Elige otra");
        }

        String neutralMessage = "Cuenta creada correctamente";
        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            return new MessageResponse(neutralMessage);
        }

        User user = new User(username, email, passwordEncoder.encode(password));
        userRepository.save(user);

        return new MessageResponse(neutralMessage);
    }

    public AuthResponse login(LoginRequest request) {
        if (request == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Datos no válidos");
        }

        String username = request.getUsername() == null ? null : request.getUsername().trim();
        String password = request.getPassword() == null ? null : request.getPassword();

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "El usuario y la contraseña son obligatorios");
        }

        if (loginAttemptService.isLocked(username)) {
            long remainingMinutes = loginAttemptService.getRemainingLockoutSeconds(username) / 60 + 1;
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS,
                    "Demasiados intentos fallidos. Inténtalo de nuevo en " + remainingMinutes + " minutos");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    passwordEncoder.matches(password, dummyPasswordHash);
                    loginAttemptService.registerFailure(username, null);
                    return new ApiException(HttpStatus.UNAUTHORIZED, NEUTRAL_LOGIN_MESSAGE);
                });

        if (!passwordEncoder.matches(password, user.getPassword())) {
            loginAttemptService.registerFailure(username, user.getEmail());
            throw new ApiException(HttpStatus.UNAUTHORIZED, NEUTRAL_LOGIN_MESSAGE);
        }

        loginAttemptService.registerSuccess(username);
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return new AuthResponse(token, user.getId(), user.getUsername());
    }
}

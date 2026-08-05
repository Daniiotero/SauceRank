package com.saucerank.controller;

import com.saucerank.dto.AuthResponse;
import com.saucerank.dto.LoginRequest;
import com.saucerank.dto.MessageResponse;
import com.saucerank.dto.RegisterRequest;
import com.saucerank.service.AuthService;
import com.saucerank.service.EmailVerificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    public AuthController(AuthService authService, EmailVerificationService emailVerificationService) {
        this.authService = authService;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<MessageResponse> verify(@RequestParam String token) {
        emailVerificationService.verify(token);
        return ResponseEntity.ok(new MessageResponse("Tu cuenta fue activada. Ya podés iniciar sesión."));
    }
}

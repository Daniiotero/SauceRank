package com.saucerank.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TokenController {

    @GetMapping("/api/check-token")
    public ResponseEntity<?> check(Authentication auth) {
        return ResponseEntity.ok().build();
    }
}

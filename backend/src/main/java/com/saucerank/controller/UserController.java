package com.saucerank.controller;

import com.saucerank.dto.UserProfileResponse;
import com.saucerank.dto.UserSummaryResponse;
import com.saucerank.model.User;
import com.saucerank.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSummaryResponse>> searchUsers(@RequestParam String q) {
        return ResponseEntity.ok(userService.searchUsers(q));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@AuthenticationPrincipal Long currentUserId,
                                                              @PathVariable String username) {
        return ResponseEntity.ok(userService.getUserProfileByUsername(username, currentUserId));
    }
}

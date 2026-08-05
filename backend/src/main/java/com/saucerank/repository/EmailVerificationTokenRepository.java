package com.saucerank.repository;

import com.saucerank.model.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByTokenHash(String tokenHash);
    void deleteByExpiresAtBefore(LocalDateTime expiresAt);
}

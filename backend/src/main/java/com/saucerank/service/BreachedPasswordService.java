package com.saucerank.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Component
public class BreachedPasswordService {

    private static final Logger log = LoggerFactory.getLogger(BreachedPasswordService.class);
    private static final String HIBP_RANGE_URL = "https://api.pwnedpasswords.com/range/";
    private static final String HIBP_ADD_PADDING_HEADER = "Add-Padding";

    private final RestClient restClient;
    private final boolean enabled;

    public BreachedPasswordService(RestClient breachCheckRestClient,
                                   @Value("${app.security.pwned-passwords.enabled:true}") boolean enabled) {
        this.restClient = breachCheckRestClient;
        this.enabled = enabled;
    }

    public boolean isBreached(String password) {
        if (!enabled || password == null || password.isEmpty()) {
            return false;
        }

        String sha1 = sha1Hex(password).toUpperCase();
        String prefix = sha1.substring(0, 5);
        String suffix = sha1.substring(5);

        String response;
        try {
            response = restClient.get()
                    .uri(HIBP_RANGE_URL + prefix)
                    .header(HIBP_ADD_PADDING_HEADER, "true")
                    .retrieve()
                    .body(String.class);
        } catch (RestClientException e) {
            log.warn("No se pudo consultar la API de contraseñas filtradas (HIBP): {}", e.getMessage());
            return false;
        }

        if (response == null) {
            return false;
        }

        return response.lines()
                .map(line -> line.split(":")[0])
                .anyMatch(hash -> hash.equalsIgnoreCase(suffix));
    }

    private String sha1Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-1 no disponible", e);
        }
    }
}

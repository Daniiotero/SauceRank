package com.saucerank.service;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class BreachedPasswordServiceTest {

    private static final String SHA1_PASSWORD = "5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8";
    private static final String PREFIX = "5BAA6";
    private static final String SUFFIX = "1E4C9B93F3F0682250B6CF8331B7EE68FD8";
    private static final String RANGE_URL = "https://api.pwnedpasswords.com/range/" + PREFIX;

    private BreachedPasswordService service;
    private MockRestServiceServer server;

    private void bindServer(boolean enabled) {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        service = new BreachedPasswordService(builder.build(), enabled);
    }

    @Test
    void isBreachedDevuelveTrueSiElHashApareceEnLaRespuesta() {
        bindServer(true);
        server.expect(requestTo(RANGE_URL))
                .andExpect(header("Add-Padding", "true"))
                .andRespond(withSuccess(SUFFIX + ":999999\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:1\n",
                        MediaType.TEXT_PLAIN));

        assertTrue(service.isBreached("password"));
        server.verify();
    }

    @Test
    void isBreachedDevuelveFalseSiElHashNoApareceEnLaRespuesta() {
        bindServer(true);
        server.expect(requestTo(RANGE_URL))
                .andRespond(withSuccess("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:1\n",
                        MediaType.TEXT_PLAIN));

        assertFalse(service.isBreached("password"));
        server.verify();
    }

    @Test
    void isBreachedDevuelveFalseSiLaApiFallá() {
        bindServer(true);
        server.expect(requestTo(RANGE_URL))
                .andRespond(withServerError());

        assertFalse(service.isBreached("password"));
        server.verify();
    }

    @Test
    void isBreachedNoLlamaHttpSiElChequeoEstaDesactivado() {
        bindServer(false);
        server.expect(requestTo(RANGE_URL)).andRespond(withSuccess("", MediaType.TEXT_PLAIN));

        assertFalse(service.isBreached("password"));
        assertThrows(AssertionError.class, server::verify);
    }

    @Test
    void isBreachedNoLlamaHttpSiLaPasswordEstaVacia() {
        bindServer(true);
        server.expect(requestTo(RANGE_URL)).andRespond(withSuccess("", MediaType.TEXT_PLAIN));

        assertFalse(service.isBreached(""));
        assertThrows(AssertionError.class, server::verify);
    }

    @Test
    void sha1DePasswordEsElEsperado() {
        bindServer(true);
        server.expect(requestTo(RANGE_URL)).andRespond(withSuccess("", MediaType.TEXT_PLAIN));

        service.isBreached("password");
        server.verify();

        assertEquals(SHA1_PASSWORD, sha1("password"));
    }

    private String sha1(String value) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-1");
            byte[] hash = digest.digest(value.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(hash).toUpperCase();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}

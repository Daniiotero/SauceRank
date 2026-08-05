package com.saucerank.config;

import com.saucerank.service.RateLimitService;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RateLimitFilterTest {

    private RateLimitService rateLimitService;
    private RateLimitFilter filter;

    @BeforeEach
    void setUp() {
        rateLimitService = mock(RateLimitService.class);
        filter = new RateLimitFilter(rateLimitService);
    }

    @Test
    void devuelve429CuandoSeSuperaElLimite() throws Exception {
        when(rateLimitService.isAllowed("127.0.0.1")).thenReturn(false);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        assertEquals(429, response.getStatus());
        assertTrue(response.getContentAsString().contains("Demasiadas solicitudes"));
        verify(chain, never()).doFilter(request, response);
    }

    @Test
    void permiteLaSolicitudSiNoSuperaElLimite() throws Exception {
        when(rateLimitService.isAllowed("127.0.0.1")).thenReturn(true);
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
    }

    @Test
    void noAplicaRateLimitFueraDeLosEndpointsDeAuth() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/albums");
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        verify(rateLimitService, never()).isAllowed(any());
    }
}

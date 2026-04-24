package com.nexus.platform.auth.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);
    private final String frontendFailureUrl;

    public OAuth2AuthenticationFailureHandler(
            @Value("${app.security.frontend.failure-url:http://localhost:3000/login?error=oauth}") String frontendFailureUrl) {
        this.frontendFailureUrl = frontendFailureUrl;
    }

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {

        log.warn("OAuth2 login failed. ip={}, path={}, error={}",
                request.getRemoteAddr(),
                request.getRequestURI(),
                exception.getMessage());

        getRedirectStrategy().sendRedirect(request, response, frontendFailureUrl);
    }
}

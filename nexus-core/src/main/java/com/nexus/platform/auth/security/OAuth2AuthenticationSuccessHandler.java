package com.nexus.platform.auth.security;

import com.nexus.platform.user.entity.User;
import com.nexus.platform.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);
    private final UserRepository userRepository;
    private final String frontendSuccessUrl;

    public OAuth2AuthenticationSuccessHandler(
            UserRepository userRepository,
            @Value("${app.security.frontend.success-url:http://localhost:3000/auth/callback?login=success}") String frontendSuccessUrl) {
        this.userRepository = userRepository;
        this.frontendSuccessUrl = frontendSuccessUrl;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauth2User.getAttributes();

        // Extract user information from OAuth2 provider
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String providerId = (String) attributes.get("sub");
        if (providerId == null) {
            providerId = (String) attributes.get("id");
        }

        User user = upsertUser(name, email, providerId);
        log.info("OAuth2 login successful. userId={}, email={}, ip={}", user.getId(), user.getEmail(), request.getRemoteAddr());

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, frontendSuccessUrl);
    }

    private User upsertUser(String name, String email, String providerSubject) {
        User user = userRepository.findByProviderSubject(providerSubject)
                .or(() -> email != null ? userRepository.findByEmail(email) : java.util.Optional.empty())
                .orElseGet(User::new);

        if (name != null && !name.isBlank()) {
            user.setName(name);
        } else if (user.getName() == null) {
            user.setName("Unknown");
        }

        if (email != null) {
            user.setEmail(email);
        }

        user.setProviderSubject(providerSubject);

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("ROLE_USER");
        }

        return userRepository.save(user);
    }
}

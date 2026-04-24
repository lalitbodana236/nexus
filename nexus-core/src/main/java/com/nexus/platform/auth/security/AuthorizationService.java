package com.nexus.platform.auth.security;

import com.nexus.platform.post.entity.Post;
import com.nexus.platform.post.repository.PostRepository;
import com.nexus.platform.user.entity.User;
import com.nexus.platform.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component("authorizationService")
public class AuthorizationService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final Set<String> adminEmails;

    public AuthorizationService(
            UserRepository userRepository,
            PostRepository postRepository,
            @Value("${app.security.admin-emails:}") String adminEmailsCsv) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.adminEmails = Arrays.stream(adminEmailsCsv.split(","))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    public boolean canAccessUser(Long userId, Authentication authentication) {
        if (!isAuthenticated(authentication)) {
            return false;
        }
        if (isAdmin(authentication)) {
            return true;
        }
        return resolveCurrentUser(authentication)
                .map(user -> user.getId().equals(userId))
                .orElse(false);
    }

    public boolean canCreatePost(Authentication authentication) {
        if (!isAuthenticated(authentication)) {
            return false;
        }
        if (isAdmin(authentication)) {
            return true;
        }
        return resolveCurrentUser(authentication).isPresent();
    }

    public boolean canAccessPost(Long postId, Authentication authentication) {
        if (!isAuthenticated(authentication)) {
            return false;
        }
        if (isAdmin(authentication)) {
            return true;
        }

        Optional<User> currentUser = resolveCurrentUser(authentication);
        if (currentUser.isEmpty()) {
            return false;
        }

        Optional<Post> post = postRepository.findById(postId);
        return post
                .map(value -> value.getAuthor() != null && value.getAuthor().getId().equals(currentUser.get().getId()))
                .orElse(false);
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null && authentication.isAuthenticated();
    }

    private boolean isAdmin(Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()))) {
            return true;
        }

        Optional<User> currentUser = resolveCurrentUser(authentication);
        if (currentUser.isPresent() && "ROLE_ADMIN".equals(currentUser.get().getRole())) {
            return true;
        }

        return extractEmail(authentication)
                .map(email -> adminEmails.contains(email.toLowerCase()))
                .orElse(false);
    }

    private Optional<String> extractEmail(Authentication authentication) {
        if (!(authentication.getPrincipal() instanceof OAuth2User oauth2User)) {
            return Optional.empty();
        }
        return Optional.ofNullable(oauth2User.getAttribute("email"));
    }

    private Optional<User> resolveCurrentUser(Authentication authentication) {
        if (!(authentication.getPrincipal() instanceof OAuth2User oauth2User)) {
            return Optional.empty();
        }

        String providerSubject = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");

        if (providerSubject != null) {
            Optional<User> bySubject = userRepository.findByProviderSubject(providerSubject);
            if (bySubject.isPresent()) {
                return bySubject;
            }
        }

        if (email != null) {
            return userRepository.findByEmail(email);
        }

        return Optional.empty();
    }
}

package com.nexus.platform.auth.controller;

import com.nexus.platform.auth.dto.AuthResponseDto;
import com.nexus.platform.auth.dto.LoginRequestDto;
import com.nexus.platform.auth.service.AuthService;
import com.nexus.platform.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@RequestBody LoginRequestDto request) {
        AuthResponseDto response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, "No authenticated user", null));
        }

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("name", principal.getAttribute("name"));
        userInfo.put("email", principal.getAttribute("email"));
        String userId = principal.getAttribute("sub");
        if (userId == null) {
            userId = principal.getAttribute("id");
        }
        userInfo.put("id", userId);

        return ResponseEntity.ok(new ApiResponse<>(true, "User info retrieved", userInfo));
    }

    @GetMapping("/login/google")
    public ResponseEntity<ApiResponse<String>> googleLogin() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Redirect to Google OAuth2",
            "/oauth2/authorization/google"));
    }
}

package com.nexus.platform.auth.service;

import com.nexus.platform.auth.dto.AuthResponseDto;
import com.nexus.platform.auth.dto.LoginRequestDto;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public AuthResponseDto login(LoginRequestDto request) {
        // This endpoint is kept for backward compatibility.
        // OAuth2 browser login is session-based and does not issue bearer tokens.
        return new AuthResponseDto(null, request.getUsername());
    }
}

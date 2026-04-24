package com.nexus.platform.auth.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexus.platform.common.response.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AuthRateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AuthRateLimitingFilter.class);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final Map<String, Deque<Long>> requestBuckets = new ConcurrentHashMap<>();
    private final int maxRequests;
    private final long windowMillis;

    public AuthRateLimitingFilter(
            @Value("${app.security.rate-limit.auth.max-requests:40}") int maxRequests,
            @Value("${app.security.rate-limit.auth.window-seconds:60}") long windowSeconds) {
        this.maxRequests = maxRequests;
        this.windowMillis = windowSeconds * 1000;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !("/auth/login".equals(path)
                || "/auth/login/google".equals(path)
                || "/oauth2/authorization/google".equals(path)
                || path.startsWith("/login/oauth2/code/"));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String bucketKey = request.getRemoteAddr() + ":" + request.getRequestURI();
        long now = Instant.now().toEpochMilli();
        Deque<Long> bucket = requestBuckets.computeIfAbsent(bucketKey, key -> new ArrayDeque<>());

        synchronized (bucket) {
            while (!bucket.isEmpty() && (now - bucket.peekFirst()) > windowMillis) {
                bucket.pollFirst();
            }

            if (bucket.size() >= maxRequests) {
                log.warn("Rate limit exceeded for auth endpoint. ip={}, path={}, maxRequests={}, windowSeconds={}",
                        request.getRemoteAddr(),
                        request.getRequestURI(),
                        maxRequests,
                        windowMillis / 1000);

                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write(OBJECT_MAPPER.writeValueAsString(
                        new ApiResponse<>(false, "Too many authentication requests. Please retry later.", null)));
                return;
            }

            bucket.addLast(now);
        }

        filterChain.doFilter(request, response);
    }
}

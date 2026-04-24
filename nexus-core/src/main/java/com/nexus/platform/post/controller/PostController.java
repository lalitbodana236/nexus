package com.nexus.platform.post.controller;

import com.nexus.platform.common.response.ApiResponse;
import com.nexus.platform.post.dto.CreatePostRequest;
import com.nexus.platform.post.dto.PostResponseDto;
import com.nexus.platform.post.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PreAuthorize("@authorizationService.canCreatePost(authentication)")
    @PostMapping
    public ResponseEntity<ApiResponse<PostResponseDto>> createPost(
            @RequestBody CreatePostRequest request,
            @AuthenticationPrincipal OAuth2User principal) {
        PostResponseDto response = postService.createPost(request, principal);
        return ResponseEntity.ok(new ApiResponse<>(true, "Post created", response));
    }

    @PreAuthorize("@authorizationService.canAccessPost(#id, authentication)")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponseDto>> getPost(@PathVariable Long id) {
        PostResponseDto response = postService.getPostById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Post fetched", response));
    }
}

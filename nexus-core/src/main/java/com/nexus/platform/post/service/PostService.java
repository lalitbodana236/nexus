package com.nexus.platform.post.service;

import com.nexus.platform.common.exception.ResourceNotFoundException;
import com.nexus.platform.post.dto.CreatePostRequest;
import com.nexus.platform.post.dto.PostResponseDto;
import com.nexus.platform.post.entity.Post;
import com.nexus.platform.post.repository.PostRepository;
import com.nexus.platform.user.entity.User;
import com.nexus.platform.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public PostResponseDto createPost(CreatePostRequest request, OAuth2User principal) {
        if (principal == null) {
            throw new AccessDeniedException("Authentication is required to create posts");
        }

        String providerSubject = principal.getAttribute("sub");
        String email = principal.getAttribute("email");

        User currentUser = resolveCurrentUser(providerSubject, email);

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(currentUser);

        Post saved = postRepository.save(post);
        return mapToDto(saved);
    }

    public PostResponseDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return mapToDto(post);
    }

    private PostResponseDto mapToDto(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAuthorId(post.getAuthor() != null ? post.getAuthor().getId() : null);
        return dto;
    }

    private User resolveCurrentUser(String providerSubject, String email) {
        if (providerSubject != null) {
            return userRepository.findByProviderSubject(providerSubject)
                    .or(() -> email != null ? userRepository.findByEmail(email) : java.util.Optional.empty())
                    .orElseThrow(() -> new AccessDeniedException("No local user mapped to authenticated account"));
        }

        if (email != null) {
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new AccessDeniedException("No local user mapped to authenticated account"));
        }

        throw new AccessDeniedException("Authenticated principal is missing required identity attributes");
    }
}

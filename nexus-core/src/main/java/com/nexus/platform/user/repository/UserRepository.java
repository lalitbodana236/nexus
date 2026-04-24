package com.nexus.platform.user.repository;

import com.nexus.platform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByProviderSubject(String providerSubject);
    Optional<User> findByEmail(String email);
}

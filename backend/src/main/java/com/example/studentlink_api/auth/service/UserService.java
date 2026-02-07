package com.example.studentlink_api.auth.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.studentlink_api.auth.entity.User;
import com.example.studentlink_api.auth.enumeration.UserRole;
import com.example.studentlink_api.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User create(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email " + user.getEmail() + " already exists");
        }
        return userRepository.save(user);
    }

    public User update(Long id, User updatedUser) {
        User user = findById(id);
        if (updatedUser.getUsername() != null)
            user.setUsername(updatedUser.getUsername());
        if (updatedUser.getEmail() != null)
            user.setEmail(updatedUser.getEmail());
        if (updatedUser.getPassword() != null)
            user.setPassword(updatedUser.getPassword());
        if (updatedUser.getRole() != null)
            user.setRole(updatedUser.getRole());
        return userRepository.save(user);
    }

    public void updatePassword(Long id, String hashedPassword){
        User user = findById(id);
        user.setPassword(hashedPassword);
        userRepository.save(user);
    }

    public void verify(User user) {
        user.setVerified(true);
        userRepository.save(user);
    }

    public User findById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User with id " + id + " does not exist"));
    }

    public User findByUsernameOrEmail(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Username or email must not be null or empty");
        }

        return userRepository.findByEmail(value)
                .or(() -> userRepository.findByUsername(value))
                .orElseThrow(() -> new NoSuchElementException("User with this username or email does not exist"));
    }

    public User findByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email must not be null or empty");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User with this email does not exist"));
    }

    public User findByUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Email must not be null or empty");
        }

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User with this username does not exist"));
    }

    public void validateUniqueness(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
    }

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    public void setBanned(Long id, boolean banned) {
        User user = findById(id);
        user.setBanned(banned);
        userRepository.save(user);
    }

    @Transactional
    public void delete(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    /**
     * Creates a new user with ADMIN role (e.g. when an admin creates another admin).
     * Does not send verification email; account is usable immediately.
     */
    @Transactional
    public User createWithRole(String username, String email, String password, UserRole role) {
        validateUniqueness(username, email);
        String hashedPassword = passwordEncoder.encode(password);
        User user = User.builder()
            .username(username)
            .email(email)
            .password(hashedPassword)
            .role(role)
            .verified(true)
            .build();
        return userRepository.save(user);
    }

}

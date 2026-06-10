package com.bookmarketplace.service;

import com.bookmarketplace.dto.request.LoginRequest;
import com.bookmarketplace.dto.request.RegisterRequest;
import com.bookmarketplace.dto.response.AuthResponse;
import com.bookmarketplace.entity.User;
import com.bookmarketplace.exception.BadRequestException;
import com.bookmarketplace.exception.ResourceNotFoundException;
import com.bookmarketplace.repository.UserRepository;
import com.bookmarketplace.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole() != null ? request.getRole() : User.Role.BUYER)
            .location(request.getLocation())
            .latitude(request.getLatitude())
            .longitude(request.getLongitude())
            .build();

        userRepository.save(user);
        log.info("New user registered: {} ({})", user.getEmail(), user.getRole());

        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.fromUser(user))
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User", 0L));

        log.info("User logged in: {}", user.getEmail());
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.fromUser(user))
            .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse.UserDto getMe(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return AuthResponse.fromUser(user);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}

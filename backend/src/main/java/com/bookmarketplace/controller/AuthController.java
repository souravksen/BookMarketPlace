package com.bookmarketplace.controller;

import com.bookmarketplace.dto.request.LoginRequest;
import com.bookmarketplace.dto.request.RegisterRequest;
import com.bookmarketplace.dto.response.ApiResponse;
import com.bookmarketplace.dto.response.AuthResponse;
import com.bookmarketplace.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Body: { name, email, password, role: "BUYER"|"SELLER" }
     * Returns: { token, user }
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(response, "Account created successfully"));
    }

    /**
     * POST /api/auth/login
     * Body: { email, password }
     * Returns: { token, user }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    /**
     * GET /api/auth/me
     * Header: Authorization: Bearer <token>
     * Returns: user profile
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserDto>> getMe(
            @AuthenticationPrincipal UserDetails userDetails) {
        AuthResponse.UserDto user = authService.getMe(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    /**
     * POST /api/auth/logout
     * (Stateless JWT — just return success; client discards token)
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }
}

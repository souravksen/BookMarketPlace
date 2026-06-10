package com.bookmarketplace.controller;

import com.bookmarketplace.dto.request.CartItemRequest;
import com.bookmarketplace.dto.request.UpdateQuantityRequest;
import com.bookmarketplace.dto.response.ApiResponse;
import com.bookmarketplace.dto.response.CartResponse;
import com.bookmarketplace.entity.User;
import com.bookmarketplace.service.AuthService;
import com.bookmarketplace.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    /**
     * GET /api/cart
     * Returns the current user's cart with items and totals
     */
    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(user)));
    }

    /**
     * POST /api/cart
     * Body: { bookId, quantity }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CartItemRequest request) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        CartResponse cart = cartService.addToCart(user, request.getBookId(), request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success(cart, "Item added to cart"));
    }

    /**
     * PUT /api/cart/{itemId}
     * Body: { quantity }
     */
    @PutMapping("/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateQuantityRequest request) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        CartResponse cart = cartService.updateCartItem(user, itemId, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success(cart, "Cart updated"));
    }

    /**
     * DELETE /api/cart/{itemId}
     */
    @DeleteMapping("/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeCartItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        CartResponse cart = cartService.removeCartItem(user, itemId);
        return ResponseEntity.ok(ApiResponse.success(cart, "Item removed from cart"));
    }

    /**
     * DELETE /api/cart
     * Clears the entire cart
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.success(null, "Cart cleared"));
    }
}

package com.bookmarketplace.controller;

import com.bookmarketplace.dto.request.OrderRequest;
import com.bookmarketplace.dto.response.ApiResponse;
import com.bookmarketplace.dto.response.OrderResponse;
import com.bookmarketplace.entity.User;
import com.bookmarketplace.service.AuthService;
import com.bookmarketplace.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    /**
     * GET /api/orders
     * Returns all orders for the logged-in user, newest first
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrders(user)));
    }

    /**
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(user, id)));
    }

    /**
     * POST /api/orders
     * Body: { items: [{bookId, quantity}], shippingName, shippingPhone,
     *         shippingAddress, shippingCity, shippingPincode }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderRequest request) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        OrderResponse order = orderService.createOrder(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(order, "Order placed successfully"));
    }

    /**
     * PUT /api/orders/{id}/cancel
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        OrderResponse order = orderService.cancelOrder(user, id);
        return ResponseEntity.ok(ApiResponse.success(order, "Order cancelled"));
    }
}

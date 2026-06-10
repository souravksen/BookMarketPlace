package com.bookmarketplace.controller;

import com.bookmarketplace.dto.response.ApiResponse;
import com.bookmarketplace.entity.Order;
import com.bookmarketplace.entity.User;
import com.bookmarketplace.repository.BookRepository;
import com.bookmarketplace.repository.OrderRepository;
import com.bookmarketplace.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final AuthService authService;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;

    /**
     * GET /api/seller/stats
     * Returns dashboard stats: totalListings, totalSales, revenue, avgRating
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        User seller = authService.getCurrentUser(userDetails.getUsername());

        long totalListings = bookRepository.findBySeller(seller).size();

        // Find all orders containing seller's books
        List<Order> allOrders = orderRepository.findAll();
        List<Order> sellerOrders = allOrders.stream()
            .filter(o -> o.getStatus() != Order.OrderStatus.CANCELLED)
            .filter(o -> o.getItems().stream()
                .anyMatch(i -> i.getBook().getSeller().getId().equals(seller.getId())))
            .collect(Collectors.toList());

        long totalSales = sellerOrders.stream()
            .flatMap(o -> o.getItems().stream())
            .filter(i -> i.getBook().getSeller().getId().equals(seller.getId()))
            .mapToLong(i -> i.getQuantity())
            .sum();

        BigDecimal revenue = sellerOrders.stream()
            .flatMap(o -> o.getItems().stream())
            .filter(i -> i.getBook().getSeller().getId().equals(seller.getId()))
            .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        double avgRating = bookRepository.findBySeller(seller).stream()
            .filter(b -> b.getReviewCount() > 0)
            .mapToDouble(b -> b.getRating())
            .average()
            .orElse(0.0);

        // Build recent transactions
        List<Map<String, Object>> transactions = sellerOrders.stream()
            .flatMap(o -> o.getItems().stream()
                .filter(i -> i.getBook().getSeller().getId().equals(seller.getId()))
                .map(i -> {
                    Map<String, Object> txn = new LinkedHashMap<>();
                    txn.put("id", "TXN-" + o.getId() + "-" + i.getId());
                    txn.put("date", o.getCreatedAt());
                    txn.put("bookTitle", i.getBook().getTitle());
                    txn.put("buyer", o.getShippingName());
                    txn.put("amount", i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())));
                    txn.put("status", o.getStatus() == Order.OrderStatus.DELIVERED ? "Completed" : "Pending");
                    return txn;
                }))
            .sorted((a, b) -> b.get("date").toString().compareTo(a.get("date").toString()))
            .limit(20)
            .collect(Collectors.toList());

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalListings", totalListings);
        stats.put("totalSales", totalSales);
        stats.put("revenue", revenue);
        stats.put("avgRating", Math.round(avgRating * 10.0) / 10.0);
        stats.put("transactions", transactions);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}

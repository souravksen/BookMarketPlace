package com.bookmarketplace.service;

import com.bookmarketplace.dto.request.OrderRequest;
import com.bookmarketplace.dto.response.OrderResponse;
import com.bookmarketplace.entity.*;
import com.bookmarketplace.exception.BadRequestException;
import com.bookmarketplace.exception.ResourceNotFoundException;
import com.bookmarketplace.repository.BookRepository;
import com.bookmarketplace.repository.CartItemRepository;
import com.bookmarketplace.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
            .map(OrderResponse::fromOrder)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(User user, Long orderId) {
        Order order = orderRepository.findByIdAndUser(orderId, user)
            .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        return OrderResponse.fromOrder(order);
    }

    @Transactional
    public OrderResponse createOrder(User user, OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Book book = bookRepository.findById(itemReq.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book", itemReq.getBookId()));

            if (!book.isInStock()) {
                throw new BadRequestException("Book '" + book.getTitle() + "' is out of stock");
            }

            BigDecimal unitPrice = book.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(subtotal);

            OrderItem item = OrderItem.builder()
                .book(book)
                .quantity(itemReq.getQuantity())
                .unitPrice(unitPrice)
                .build();
            orderItems.add(item);
        }

        Order order = Order.builder()
            .user(user)
            .totalAmount(total)
            .status(Order.OrderStatus.CONFIRMED)
            .shippingName(request.getShippingName())
            .shippingPhone(request.getShippingPhone())
            .shippingAddress(request.getShippingAddress())
            .shippingCity(request.getShippingCity())
            .shippingPincode(request.getShippingPincode())
            .build();

        // Link items to order
        orderItems.forEach(item -> item.setOrder(order));
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);

        // Clear cart after order
        cartItemRepository.deleteByUser(user);

        log.info("Order #{} created for user: {} — Total: ₹{}",
            saved.getId(), user.getEmail(), saved.getTotalAmount());

        return OrderResponse.fromOrder(saved);
    }

    @Transactional
    public OrderResponse cancelOrder(User user, Long orderId) {
        Order order = orderRepository.findByIdAndUser(orderId, user)
            .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new BadRequestException("Delivered orders cannot be cancelled");
        }
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);
        log.info("Order #{} cancelled by user: {}", orderId, user.getEmail());
        return OrderResponse.fromOrder(saved);
    }
}

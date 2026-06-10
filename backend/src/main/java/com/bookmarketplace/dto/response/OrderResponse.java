package com.bookmarketplace.dto.response;

import com.bookmarketplace.entity.Order;
import com.bookmarketplace.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private String status;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingPincode;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        private Long id;
        private BookResponse book;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }

    public static OrderResponse fromOrder(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
            .map(OrderResponse::fromOrderItem)
            .collect(Collectors.toList());

        return OrderResponse.builder()
            .id(order.getId())
            .items(itemDtos)
            .totalAmount(order.getTotalAmount())
            .status(order.getStatus().name())
            .shippingName(order.getShippingName())
            .shippingPhone(order.getShippingPhone())
            .shippingAddress(order.getShippingAddress())
            .shippingCity(order.getShippingCity())
            .shippingPincode(order.getShippingPincode())
            .createdAt(order.getCreatedAt())
            .build();
    }

    private static OrderItemDto fromOrderItem(OrderItem item) {
        BigDecimal subtotal = item.getUnitPrice()
            .multiply(BigDecimal.valueOf(item.getQuantity()));
        return OrderItemDto.builder()
            .id(item.getId())
            .book(BookResponse.fromBook(item.getBook()))
            .quantity(item.getQuantity())
            .unitPrice(item.getUnitPrice())
            .subtotal(subtotal)
            .build();
    }
}

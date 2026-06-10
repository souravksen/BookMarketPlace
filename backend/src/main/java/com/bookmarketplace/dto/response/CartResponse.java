package com.bookmarketplace.dto.response;

import com.bookmarketplace.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private List<CartItemDto> items;
    private BigDecimal total;
    private Integer itemCount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemDto {
        private Long id;
        private BookResponse book;
        private Integer quantity;
        private BigDecimal subtotal;
    }

    public static CartItemDto fromCartItem(CartItem item) {
        BigDecimal subtotal = item.getBook().getPrice()
            .multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemDto.builder()
            .id(item.getId())
            .book(BookResponse.fromBook(item.getBook()))
            .quantity(item.getQuantity())
            .subtotal(subtotal)
            .build();
    }
}

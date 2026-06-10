package com.bookmarketplace.dto.response;

import com.bookmarketplace.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String category;
    private String condition;
    private String description;
    private String image;
    private List<String> images;
    private boolean inStock;
    private Double rating;
    private Integer reviewCount;
    private SellerDto seller;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerDto {
        private Long id;
        private String name;
        private String location;
        private Double rating;
        private Integer totalSales;
    }

    public static BookResponse fromBook(Book book) {
        return BookResponse.builder()
            .id(book.getId())
            .title(book.getTitle())
            .author(book.getAuthor())
            .price(book.getPrice())
            .originalPrice(book.getOriginalPrice())
            .category(book.getCategory())
            .condition(book.getCondition())
            .description(book.getDescription())
            .image(book.getImage())
            .images(book.getImages().isEmpty() ? List.of(book.getImage()) : book.getImages())
            .inStock(book.isInStock())
            .rating(book.getRating())
            .reviewCount(book.getReviewCount())
            .seller(SellerDto.builder()
                .id(book.getSeller().getId())
                .name(book.getSeller().getName())
                .location(book.getSeller().getLocation())
                .rating(4.5)
                .totalSales(0)
                .build())
            .createdAt(book.getCreatedAt())
            .build();
    }
}

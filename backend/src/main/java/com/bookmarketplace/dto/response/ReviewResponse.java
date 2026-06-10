package com.bookmarketplace.dto.response;

import com.bookmarketplace.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private Integer rating;
    private String comment;
    private String user;
    private LocalDateTime date;

    public static ReviewResponse fromReview(Review review) {
        return ReviewResponse.builder()
            .id(review.getId())
            .rating(review.getRating())
            .comment(review.getComment())
            .user(review.getUser().getName())
            .date(review.getCreatedAt())
            .build();
    }
}

package com.bookmarketplace.repository;

import com.bookmarketplace.entity.Review;
import com.bookmarketplace.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBook(Book book);
    boolean existsByBookIdAndUserId(Long bookId, Long userId);
}

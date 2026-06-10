package com.bookmarketplace.repository;

import com.bookmarketplace.entity.CartItem;
import com.bookmarketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndBookId(User user, Long bookId);
    void deleteByUser(User user);
}

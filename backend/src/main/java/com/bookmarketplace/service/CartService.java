package com.bookmarketplace.service;

import com.bookmarketplace.dto.response.CartResponse;
import com.bookmarketplace.entity.Book;
import com.bookmarketplace.entity.CartItem;
import com.bookmarketplace.entity.User;
import com.bookmarketplace.exception.BadRequestException;
import com.bookmarketplace.exception.ResourceNotFoundException;
import com.bookmarketplace.repository.BookRepository;
import com.bookmarketplace.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        return buildCartResponse(items);
    }

    @Transactional
    public CartResponse addToCart(User user, Long bookId, Integer quantity) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Book", bookId));

        if (!book.isInStock()) {
            throw new BadRequestException("This book is currently out of stock");
        }

        // If already in cart, increase quantity
        CartItem item = cartItemRepository.findByUserAndBookId(user, bookId)
            .orElseGet(() -> CartItem.builder().user(user).book(book).quantity(0).build());

        item.setQuantity(item.getQuantity() + (quantity != null ? quantity : 1));
        cartItemRepository.save(item);

        return buildCartResponse(cartItemRepository.findByUser(user));
    }

    @Transactional
    public CartResponse updateCartItem(User user, Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item", itemId));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Cart item does not belong to you");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return buildCartResponse(cartItemRepository.findByUser(user));
    }

    @Transactional
    public CartResponse removeCartItem(User user, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item", itemId));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Cart item does not belong to you");
        }

        cartItemRepository.delete(item);
        return buildCartResponse(cartItemRepository.findByUser(user));
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
        log.info("Cart cleared for user: {}", user.getEmail());
    }

    // ─────────────────────────── HELPERS ───────────────────────────

    private CartResponse buildCartResponse(List<CartItem> items) {
        List<CartResponse.CartItemDto> dtos = items.stream()
            .map(CartResponse::fromCartItem)
            .collect(Collectors.toList());

        BigDecimal total = dtos.stream()
            .map(CartResponse.CartItemDto::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        int itemCount = items.stream()
            .mapToInt(CartItem::getQuantity)
            .sum();

        return CartResponse.builder()
            .items(dtos)
            .total(total)
            .itemCount(itemCount)
            .build();
    }
}

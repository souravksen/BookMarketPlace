package com.bookmarketplace.controller;

import com.bookmarketplace.dto.request.ReviewRequest;
import com.bookmarketplace.dto.response.ApiResponse;
import com.bookmarketplace.dto.response.BookResponse;
import com.bookmarketplace.dto.response.ReviewResponse;
import com.bookmarketplace.entity.User;
import com.bookmarketplace.service.AuthService;
import com.bookmarketplace.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final AuthService authService;

    // ─────────────────────────── PUBLIC ───────────────────────────

    /**
     * GET /api/books?category=&condition=&search=&minPrice=&maxPrice=&page=0&size=12&sortBy=createdAt&sortDir=desc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<BookResponse>>> getAllBooks(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<BookResponse> books = bookService.getAllBooks(
            category, condition, search, minPrice, maxPrice, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(books));
    }

    /**
     * GET /api/books/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(bookService.getCategories()));
    }

    /**
     * GET /api/books/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookService.getBookById(id)));
    }

    /**
     * GET /api/books/{bookId}/reviews
     */
    @GetMapping("/{bookId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviews(@PathVariable Long bookId) {
        return ResponseEntity.ok(ApiResponse.success(bookService.getReviews(bookId)));
    }

    // ─────────────────────────── SELLER ───────────────────────────

    /**
     * GET /api/books/seller/my-listings  (SELLER only)
     */
    @GetMapping("/seller/my-listings")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getMyListings(
            @AuthenticationPrincipal UserDetails userDetails) {
        User seller = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bookService.getSellerBooks(seller)));
    }

    /**
     * POST /api/books  (SELLER only — multipart/form-data)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<BookResponse>> createBook(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String title,
            @RequestParam String author,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) BigDecimal originalPrice,
            @RequestParam String category,
            @RequestParam String condition,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image) throws IOException {

        User seller = authService.getCurrentUser(userDetails.getUsername());
        BookResponse response = bookService.createBook(
            seller, title, author, price, originalPrice, category, condition, description, image);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(response, "Book listing created"));
    }

    /**
     * PUT /api/books/{id}  (SELLER only — multipart/form-data)
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<BookResponse>> updateBook(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) BigDecimal originalPrice,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image) throws IOException {

        User seller = authService.getCurrentUser(userDetails.getUsername());
        BookResponse response = bookService.updateBook(
            id, seller, title, author, price, originalPrice, category, condition, description, image);
        return ResponseEntity.ok(ApiResponse.success(response, "Book listing updated"));
    }

    /**
     * DELETE /api/books/{id}  (SELLER only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User seller = authService.getCurrentUser(userDetails.getUsername());
        bookService.deleteBook(id, seller);
        return ResponseEntity.ok(ApiResponse.success(null, "Book listing deleted"));
    }

    /**
     * POST /api/books/{bookId}/reviews  (authenticated)
     */
    @PostMapping("/{bookId}/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @PathVariable Long bookId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        ReviewResponse review = bookService.addReview(bookId, user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(review, "Review submitted"));
    }
}

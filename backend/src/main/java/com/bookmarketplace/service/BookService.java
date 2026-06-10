package com.bookmarketplace.service;

import com.bookmarketplace.dto.request.ReviewRequest;
import com.bookmarketplace.dto.response.BookResponse;
import com.bookmarketplace.dto.response.ReviewResponse;
import com.bookmarketplace.entity.Book;
import com.bookmarketplace.entity.Review;
import com.bookmarketplace.entity.User;
import com.bookmarketplace.exception.BadRequestException;
import com.bookmarketplace.exception.ResourceNotFoundException;
import com.bookmarketplace.repository.BookRepository;
import com.bookmarketplace.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    // ─────────────────────────── PUBLIC ───────────────────────────

    @Transactional(readOnly = true)
    public Page<BookResponse> getAllBooks(String category, String condition,
                                          String search, Double minPrice, Double maxPrice,
                                          int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String catParam = (category != null && !category.isBlank()) ? category : null;
        String condParam = (condition != null && !condition.isBlank()) ? condition : null;
        String searchParam = (search != null && !search.isBlank()) ? search : null;

        return bookRepository
            .findWithFilters(catParam, condParam, searchParam, minPrice, maxPrice, pageable)
            .map(BookResponse::fromBook);
    }

    @Transactional(readOnly = true)
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book", id));
        return BookResponse.fromBook(book);
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        List<String> fromDb = bookRepository.findAllCategories();
        if (!fromDb.isEmpty()) return fromDb;
        // Seed default categories if DB is empty
        return List.of(
            "Fiction", "Non-Fiction", "Science", "Technology", "History",
            "Biography", "Self-Help", "Education", "Children", "Comics",
            "Philosophy", "Art & Design", "Business", "Economics", "Religion"
        );
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(Long bookId) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Book", bookId));
        return reviewRepository.findByBook(book).stream()
            .map(ReviewResponse::fromReview)
            .collect(Collectors.toList());
    }

    // ─────────────────────────── SELLER ───────────────────────────

    @Transactional(readOnly = true)
    public List<BookResponse> getSellerBooks(User seller) {
        return bookRepository.findBySeller(seller).stream()
            .map(BookResponse::fromBook)
            .collect(Collectors.toList());
    }

    @Transactional
    public BookResponse createBook(User seller, String title, String author,
                                    BigDecimal price, BigDecimal originalPrice,
                                    String category, String condition, String description,
                                    MultipartFile imageFile) throws IOException {

        String imageUrl = imageFile != null && !imageFile.isEmpty()
            ? saveImage(imageFile) : null;

        Book book = Book.builder()
            .title(title)
            .author(author)
            .price(price)
            .originalPrice(originalPrice)
            .category(category)
            .condition(condition)
            .description(description)
            .image(imageUrl)
            .seller(seller)
            .inStock(true)
            .build();

        if (imageUrl != null) book.getImages().add(imageUrl);

        Book saved = bookRepository.save(book);
        log.info("Book created: '{}' by seller {}", saved.getTitle(), seller.getEmail());
        return BookResponse.fromBook(saved);
    }

    @Transactional
    public BookResponse updateBook(Long bookId, User seller, String title, String author,
                                    BigDecimal price, BigDecimal originalPrice,
                                    String category, String condition, String description,
                                    MultipartFile imageFile) throws IOException {

        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Book", bookId));

        if (!book.getSeller().getId().equals(seller.getId())) {
            throw new BadRequestException("You can only edit your own listings");
        }

        if (title != null) book.setTitle(title);
        if (author != null) book.setAuthor(author);
        if (price != null) book.setPrice(price);
        if (originalPrice != null) book.setOriginalPrice(originalPrice);
        if (category != null) book.setCategory(category);
        if (condition != null) book.setCondition(condition);
        if (description != null) book.setDescription(description);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = saveImage(imageFile);
            book.setImage(imageUrl);
        }

        Book updated = bookRepository.save(book);
        return BookResponse.fromBook(updated);
    }

    @Transactional
    public void deleteBook(Long bookId, User seller) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Book", bookId));

        if (!book.getSeller().getId().equals(seller.getId())) {
            throw new BadRequestException("You can only delete your own listings");
        }

        bookRepository.delete(book);
        log.info("Book deleted: id={}", bookId);
    }

    @Transactional
    public ReviewResponse addReview(Long bookId, User user, ReviewRequest request) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Book", bookId));

        if (reviewRepository.existsByBookIdAndUserId(bookId, user.getId())) {
            throw new BadRequestException("You have already reviewed this book");
        }

        Review review = Review.builder()
            .book(book)
            .user(user)
            .rating(request.getRating())
            .comment(request.getComment())
            .build();

        reviewRepository.save(review);

        // Recalculate rating
        List<Review> reviews = reviewRepository.findByBook(book);
        double avg = reviews.stream()
            .mapToInt(Review::getRating)
            .average()
            .orElse(0.0);
        book.setRating(Math.round(avg * 10.0) / 10.0);
        book.setReviewCount(reviews.size());
        bookRepository.save(book);

        return ReviewResponse.fromReview(review);
    }

    // ─────────────────────────── HELPERS ───────────────────────────

    private String saveImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        String ext = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf("."));
        }

        String filename = UUID.randomUUID() + ext;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + filename;
    }
}

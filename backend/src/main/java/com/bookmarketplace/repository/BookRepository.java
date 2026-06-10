package com.bookmarketplace.repository;

import com.bookmarketplace.entity.Book;
import com.bookmarketplace.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findBySeller(User seller);

    Page<Book> findAll(Pageable pageable);

    @Query("""
        SELECT b FROM Book b
        WHERE (:category IS NULL OR b.category = :category)
          AND (:condition IS NULL OR b.condition = :condition)
          AND (:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:minPrice IS NULL OR b.price >= :minPrice)
          AND (:maxPrice IS NULL OR b.price <= :maxPrice)
    """)
    Page<Book> findWithFilters(
        @Param("category") String category,
        @Param("condition") String condition,
        @Param("search") String search,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice,
        Pageable pageable
    );

    @Query("SELECT DISTINCT b.category FROM Book b ORDER BY b.category")
    List<String> findAllCategories();
}

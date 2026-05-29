package com.raiza.demo.product.repository;

import com.raiza.demo.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByName(String name);

    List<Product> findByCategory(String category);

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByFeaturedTrueOrderByNameAsc();
}

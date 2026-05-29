package com.raiza.demo.product.service;

import com.raiza.demo.product.dto.CreateProductRequest;
import com.raiza.demo.product.dto.ProductResponse;
import com.raiza.demo.product.entity.Product;
import com.raiza.demo.product.mapper.ProductMapper;
import com.raiza.demo.product.repository.ProductRepository;
import com.raiza.demo.shared.exception.DuplicateResourceException;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return productRepository.findAll().stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> find(Boolean featured, String category) {
        List<Product> result;
        if (Boolean.TRUE.equals(featured)) {
            result = productRepository.findByFeaturedTrueOrderByNameAsc();
        } else if (category != null && !category.isBlank()) {
            result = productRepository.findByCategoryIgnoreCase(category);
        } else {
            result = productRepository.findAll();
        }
        return result.stream().map(productMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return productMapper.toResponse(getProductOrThrow(id));
    }

    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        productRepository.findByName(request.name()).ifPresent(existing -> {
            throw new DuplicateResourceException("Product already exists: " + request.name());
        });
        Product saved = productRepository.save(productMapper.toEntity(request));
        return productMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Product getProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", id));
    }
}

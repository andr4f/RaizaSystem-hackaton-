package com.raiza.demo.product.api;

import com.raiza.demo.product.dto.CreateProductRequest;
import com.raiza.demo.product.dto.ProductResponse;
import com.raiza.demo.product.service.ProductService;
import com.raiza.demo.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Validated
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> create(
            @RequestBody @Valid CreateProductRequest req,
            UriComponentsBuilder uriBuilder) {
        ProductResponse created = productService.create(req);
        URI location = uriBuilder.path("/api/v1/products/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    // Público — catálogo usado en el onboarding. Soporta ?featured=true y ?category=
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> findAll(
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String category) {
        if (featured != null || category != null) {
            return ResponseEntity.ok(ApiResponse.ok(productService.find(featured, category)));
        }
        return ResponseEntity.ok(ApiResponse.ok(productService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.findById(id)));
    }
}

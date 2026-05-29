package com.raiza.demo.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProductRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 50) String category,
        @NotBlank @Size(max = 20) String unitOfMeasure,
        String description,
        boolean featured
) {
}

package com.raiza.demo.product.dto;

public record ProductResponse(
        Long id,
        String name,
        String category,
        String unitOfMeasure,
        String description
) {
}

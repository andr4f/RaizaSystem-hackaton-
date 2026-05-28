package com.raiza.demo.product.mapper;

import com.raiza.demo.product.dto.CreateProductRequest;
import com.raiza.demo.product.dto.ProductResponse;
import com.raiza.demo.product.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toEntity(CreateProductRequest request);

    ProductResponse toResponse(Product product);
}

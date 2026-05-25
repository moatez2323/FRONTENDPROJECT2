package com.moatez.firstrestapi.product.support;

import com.moatez.firstrestapi.product.api.request.ProductRequest;
import com.moatez.firstrestapi.product.api.response.ProductResponse;
import com.moatez.firstrestapi.product.domain.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequest request) {

        return new Product(
                null,
                request.getName(),
                request.getPrice(),
                request.getCategory(),
                request.getImageUrl()
        );
    }

    public ProductResponse toResponse(Product product) {

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getCategory(),
                product.getImageUrl()
        );
    }
}
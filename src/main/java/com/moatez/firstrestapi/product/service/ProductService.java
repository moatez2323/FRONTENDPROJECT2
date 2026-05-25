package com.moatez.firstrestapi.product.service;

import com.moatez.firstrestapi.product.api.request.ProductRequest;
import com.moatez.firstrestapi.product.api.request.UpdateProductRequest;
import com.moatez.firstrestapi.product.api.response.ProductResponse;
import com.moatez.firstrestapi.product.domain.Product;
import com.moatez.firstrestapi.product.exception.ProductNotFoundException;
import com.moatez.firstrestapi.product.repository.ProductRepository;
import com.moatez.firstrestapi.product.support.ProductMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    public ProductResponse create(ProductRequest request) {

        Product product = productMapper.toEntity(request);

        Product savedProduct = productRepository.save(product);

        return productMapper.toResponse(savedProduct);
    }

    public ProductResponse findById(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(id)
                );

        return productMapper.toResponse(product);
    }

    public ProductResponse update(Long id, UpdateProductRequest request) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(id)
                );

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        Product savedProduct = productRepository.save(product);

        return productMapper.toResponse(savedProduct);
    }

    public void delete(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(id)
                );

        productRepository.deleteById(id);
    }

    public List<ProductResponse> findAll() {

        return productRepository
                .findAll()
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }
}
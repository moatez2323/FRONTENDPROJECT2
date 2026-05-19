package com.moatez.firstrestapi.product.repository;

import com.moatez.firstrestapi.product.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
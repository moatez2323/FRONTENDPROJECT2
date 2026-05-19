package com.moatez.firstrestapi.product.api.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateProductRequest {

    @NotBlank(message = "Name cannot be blank")
    private String name;

    public String getName() {
        return name;
    }
}
package com.moatez.firstrestapi.product.api.request;

public class UpdateProductRequest {

    private String name;

    private Double price;

    private String category;

    private String imageUrl;

    public String getName() {
        return name;
    }

    public Double getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}
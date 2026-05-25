package com.moatez.firstrestapi.product.api.response;

public class ProductResponse {

    private Long id;

    private String name;

    private Double price;

    private String category;

    private String imageUrl;

    public ProductResponse(
            Long id,
            String name,
            Double price,
            String category,
            String imageUrl
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

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
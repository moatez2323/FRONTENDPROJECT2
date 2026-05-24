
# ProductHub - Product Store Management System

## Description

ProductHub is a full-stack product management web application built with Spring Boot, HTML, CSS, and JavaScript.

The project started as a REST API and was extended with a professional frontend interface.  
It allows users to manage products through a modern store-style dashboard.

The application supports:
- Creating products
- Viewing products
- Updating products
- Deleting products
- Searching products
- Filtering products by category
- Adding products to a cart
- Viewing cart items
- Dark mode

---

# Technologies Used

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- H2 Database
- Swagger OpenAPI
- HTML
- CSS
- JavaScript
- Maven

---

# Backend Features

The backend provides REST API endpoints for product management.

## API Endpoints

### Create Product

POST /api/v1/products

### Get All Products

GET /api/v1/products

### Get Product By ID

GET /api/v1/products/{id}

### Update Product

PUT /api/v1/products/{id}

### Delete Product

DELETE /api/v1/products/{id}

---

# Product Data Structure

Example product JSON:

```json
{
  "name": "IPHONE 19 PRO MAX",
  "price": 2000,
  "category": "Electronics",
  "imageUrl": "https://example.com/image.jpg"
}
````

---

# Frontend Features

The frontend was created using HTML, CSS, and JavaScript.

It includes:

* Product cards
* Product images
* Product prices
* Product categories
* Search bar
* Category filter
* Add product button
* Edit product button
* Delete product button
* Cart sidebar
* Dark mode design

Frontend URL:

[http://localhost:8080/index.html](http://localhost:8080/index.html)

---

# H2 Database

The project uses H2 in-memory database for testing and development.

## H2 Console URL

[http://localhost:8080/console](http://localhost:8080/console)

## JDBC URL

jdbc:h2:mem:testdb

## Example SQL Query

```sql
SELECT * FROM PRODUCT;
```

---

# How to Run the Project

1. Open the project in IntelliJ IDEA
2. Reload Maven dependencies
3. Run the Spring Boot application
4. Open the frontend page:

[http://localhost:8080/index.html](http://localhost:8080/index.html)

5. Open H2 console:

[http://localhost:8080/console](http://localhost:8080/console)

---

# Project Architecture

The project follows layered architecture:

* Controller Layer → handles HTTP requests
* Service Layer → contains business logic
* Repository Layer → communicates with database
* Domain Layer → represents database entities
* Frontend Layer → built with HTML, CSS, and JavaScript

---

# Screenshots

The following screenshots show the application working with frontend, backend, database, cart system, and dark mode.

## Frontend Product Dashboard
<img width="1914" height="1015" alt="Screenshot 2026-05-24 203002" src="https://github.com/user-attachments/assets/ded46084-bd05-455e-b3fc-5327e6b9d0ba" />


---

## H2 Database Product Table

<img width="1911" height="1016" alt="Screenshot 2026-05-24 203044" src="https://github.com/user-attachments/assets/83de75c2-32ce-4dc9-9477-fed1591c4346" />


---

## Shopping Cart Sidebar

<img width="1915" height="999" alt="Screenshot 2026-05-24 203101" src="https://github.com/user-attachments/assets/a4961dda-4743-46b7-b674-229c196ad104" />

---

## Dark Mode Interface

<img width="1919" height="957" alt="Screenshot 2026-05-24 203114" src="https://github.com/user-attachments/assets/84961637-8aae-4400-bd2f-681c69a44a52" />


---

# Author

Moatez Billah Ramdani 74822

```
```

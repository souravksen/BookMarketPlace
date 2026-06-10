package com.bookmarketplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemRequest> items;

    @NotBlank(message = "Shipping name is required")
    private String shippingName;

    @NotBlank(message = "Phone number is required")
    private String shippingPhone;

    @NotBlank(message = "Address is required")
    private String shippingAddress;

    @NotBlank(message = "City is required")
    private String shippingCity;

    @NotBlank(message = "Pincode is required")
    private String shippingPincode;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long bookId;

        @NotNull
        private Integer quantity;
    }
}

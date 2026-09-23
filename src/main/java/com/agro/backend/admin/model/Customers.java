package com.agro.backend.admin.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "customers")
public class Customers {

    @Id
    private String id;

    // Business Customer ID
    private String customerId;

    private String name;
    private String email;
    private String phone;
    private String location;

    private LocalDate date;

    private String status;
    private String paymentStatus;

    private String notes;
}
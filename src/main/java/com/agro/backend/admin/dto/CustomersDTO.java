package com.agro.backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomersDTO {

    private String id;
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
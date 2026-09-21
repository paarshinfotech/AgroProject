package com.agro.backend.admin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agro.backend.admin.service.CustomerService;

@RestController
@RequestMapping("/api/admin/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/count")
    public long getTotalCustomers() {
        return customerService.getTotalCustomers();
    }
}
package com.agro.backend.admin.controller;

import com.agro.backend.admin.model.Customers;
import com.agro.backend.admin.service.CustomersService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/customers-management")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomersController {

    private final CustomersService customersService;

    public CustomersController(CustomersService customersService) {
        this.customersService = customersService;
    }

    // =====================================================
    // GET ALL CUSTOMERS - PAGINATION
    // =====================================================

    @GetMapping
    public Page<Customers> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("name").ascending()
        );

        return customersService.getAllCustomers(pageable);
    }

    // =====================================================
    // TOTAL CUSTOMER COUNT
    // =====================================================

    @GetMapping("/count")
    public long getCustomerCount() {

        return customersService.getTotalCustomers();
    }

    // =====================================================
    // SEARCH CUSTOMER
    // Customer ID / Name / Email / Phone
    // =====================================================

    @GetMapping("/search")
    public Page<Customers> searchCustomers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(
                page,
                size
        );

        return customersService.searchCustomers(
                keyword,
                pageable
        );
    }

    // =====================================================
    // FILTER BY STATUS
    // =====================================================

    @GetMapping("/filter/status")
    public Page<Customers> getByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(
                page,
                size
        );

        return customersService.getByStatus(
                status,
                pageable
        );
    }

    // =====================================================
    // FILTER BY PAYMENT STATUS
    // =====================================================

    @GetMapping("/filter/payment-status")
    public Page<Customers> getByPaymentStatus(
            @RequestParam String paymentStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(
                page,
                size
        );

        return customersService.getByPaymentStatus(
                paymentStatus,
                pageable
        );
    }

    // =====================================================
    // GET CUSTOMER BY MONGODB ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Customers> getCustomerById(
            @PathVariable String id) {

        return customersService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =====================================================
    // CREATE CUSTOMER
    // =====================================================

    @PostMapping
    public ResponseEntity<Customers> createCustomer(
            @RequestBody Customers customer) {

        Customers savedCustomer =
                customersService.createCustomer(customer);

        return ResponseEntity.ok(savedCustomer);
    }

    // =====================================================
    // UPDATE CUSTOMER
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Customers> updateCustomer(
            @PathVariable String id,
            @RequestBody Customers customer) {

        return customersService.updateCustomer(
                id,
                customer
        )
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }

    // =====================================================
    // DELETE CUSTOMER
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable String id) {

        if (customersService.deleteCustomer(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
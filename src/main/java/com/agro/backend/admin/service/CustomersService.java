package com.agro.backend.admin.service;

import com.agro.backend.admin.model.Customers;
import com.agro.backend.admin.repository.CustomersRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomersService {

    private final CustomersRepository customersRepository;

    public CustomersService(CustomersRepository customersRepository) {
        this.customersRepository = customersRepository;
    }

    // =====================================================
    // GET ALL CUSTOMERS
    // =====================================================

    public Page<Customers> getAllCustomers(Pageable pageable) {
        return customersRepository.findAll(pageable);
    }

    // =====================================================
    // GET CUSTOMER BY MONGODB ID
    // =====================================================

    public Optional<Customers> getCustomerById(String id) {
        return customersRepository.findById(id);
    }

    // =====================================================
    // SEARCH CUSTOMER
    // Customer ID / Name / Email / Phone
    // =====================================================

    public Page<Customers> searchCustomers(
            String keyword,
            Pageable pageable) {

        return customersRepository.searchCustomers(
                keyword,
                pageable
        );
    }

    // =====================================================
    // FILTER BY STATUS
    // =====================================================

    public Page<Customers> getByStatus(
            String status,
            Pageable pageable) {

        return customersRepository.findByStatusIgnoreCase(
                status,
                pageable
        );
    }

    // =====================================================
    // FILTER BY PAYMENT STATUS
    // =====================================================

    public Page<Customers> getByPaymentStatus(
            String paymentStatus,
            Pageable pageable) {

        return customersRepository.findByPaymentStatusIgnoreCase(
                paymentStatus,
                pageable
        );
    }

    // =====================================================
    // CREATE CUSTOMER
    // Automatically generates CUST001, CUST002...
    // =====================================================

    public Customers createCustomer(Customers customer) {

        long nextNumber = customersRepository.count() + 1;

        String customerId = String.format(
                "CUST%03d",
                nextNumber
        );

        customer.setCustomerId(customerId);

        return customersRepository.save(customer);
    }

    // =====================================================
    // UPDATE CUSTOMER
    // =====================================================

    public Optional<Customers> updateCustomer(
            String id,
            Customers updatedCustomer) {

        return customersRepository.findById(id)
                .map(existingCustomer -> {

                    existingCustomer.setCustomerId(
                            updatedCustomer.getCustomerId()
                    );

                    existingCustomer.setName(
                            updatedCustomer.getName()
                    );

                    existingCustomer.setEmail(
                            updatedCustomer.getEmail()
                    );

                    existingCustomer.setPhone(
                            updatedCustomer.getPhone()
                    );

                    existingCustomer.setLocation(
                            updatedCustomer.getLocation()
                    );

                    existingCustomer.setDate(
                            updatedCustomer.getDate()
                    );

                    existingCustomer.setStatus(
                            updatedCustomer.getStatus()
                    );

                    existingCustomer.setPaymentStatus(
                            updatedCustomer.getPaymentStatus()
                    );

                    existingCustomer.setNotes(
                            updatedCustomer.getNotes()
                    );

                    return customersRepository.save(
                            existingCustomer
                    );
                });
    }

    // =====================================================
    // DELETE CUSTOMER
    // =====================================================

    public boolean deleteCustomer(String id) {

        if (!customersRepository.existsById(id)) {
            return false;
        }

        customersRepository.deleteById(id);

        return true;
    }

    // =====================================================
    // TOTAL CUSTOMER COUNT
    // =====================================================

    public long getTotalCustomers() {
        return customersRepository.count();
    }
}
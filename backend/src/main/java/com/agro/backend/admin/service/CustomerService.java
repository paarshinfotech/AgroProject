package com.agro.backend.admin.service;

import org.springframework.stereotype.Service;

import com.agro.backend.admin.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public long getTotalCustomers() {
        return customerRepository.count();
    }
}
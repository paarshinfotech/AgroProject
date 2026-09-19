package com.agro.backend.admin.service;

import com.agro.backend.admin.model.Customer;
import com.agro.backend.admin.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get total customers
    public long getTotalCustomers() {
        return customerRepository.count();
    }

    // Get customer by ID
    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    // Search customer
    public List<Customer> searchCustomers(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return customerRepository.findAll();
        }

        String search = keyword.trim();

        List<Customer> customers =
                customerRepository.findByNameContainingIgnoreCase(search);

        if (!customers.isEmpty()) {
            return customers;
        }

        customers =
                customerRepository.findByEmailContainingIgnoreCase(search);

        if (!customers.isEmpty()) {
            return customers;
        }

        return customerRepository.findByPhoneContaining(search);
    }

    // Create customer
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Update customer
    public Optional<Customer> updateCustomer(String id, Customer updatedCustomer) {

        return customerRepository.findById(id).map(existingCustomer -> {

            existingCustomer.setName(updatedCustomer.getName());
            existingCustomer.setEmail(updatedCustomer.getEmail());
            existingCustomer.setPhone(updatedCustomer.getPhone());
            existingCustomer.setLocation(updatedCustomer.getLocation());
            existingCustomer.setDate(updatedCustomer.getDate());
            existingCustomer.setStatus(updatedCustomer.getStatus());
            existingCustomer.setPaymentStatus(updatedCustomer.getPaymentStatus());
            existingCustomer.setNotes(updatedCustomer.getNotes());

            return customerRepository.save(existingCustomer);
        });
    }

    // Delete customer
    public boolean deleteCustomer(String id) {

        if (!customerRepository.existsById(id)) {
            return false;
        }

        customerRepository.deleteById(id);
        return true;
    }
}
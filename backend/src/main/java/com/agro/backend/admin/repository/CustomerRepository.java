package com.agro.backend.admin.repository;

import com.agro.backend.admin.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CustomerRepository extends MongoRepository<Customer, String> {

    List<Customer> findByNameContainingIgnoreCase(String name);

    List<Customer> findByEmailContainingIgnoreCase(String email);

    List<Customer> findByPhoneContaining(String phone);

    List<Customer> findByStatusIgnoreCase(String status);

    List<Customer> findByPaymentStatusIgnoreCase(String paymentStatus);

    List<Customer> findByLocationIgnoreCase(String location);
}
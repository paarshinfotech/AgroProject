package com.agro.backend.admin.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.agro.backend.admin.model.Customer;

public interface CustomerRepository extends MongoRepository<Customer, String> {
}
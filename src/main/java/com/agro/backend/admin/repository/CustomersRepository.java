package com.agro.backend.admin.repository;

import com.agro.backend.admin.model.Customers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface CustomersRepository extends MongoRepository<Customers, String> {

    // Search by Customer ID, Name, Email or Phone
    @Query("{ '$or': [ " +
            "{ 'customerId': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'name': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'email': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'phone': { '$regex': ?0 } } " +
            "] }")
    Page<Customers> searchCustomers(
            String keyword,
            Pageable pageable
    );

    // Filter by Status
    Page<Customers> findByStatusIgnoreCase(
            String status,
            Pageable pageable
    );

    // Filter by Payment Status
    Page<Customers> findByPaymentStatusIgnoreCase(
            String paymentStatus,
            Pageable pageable
    );
}
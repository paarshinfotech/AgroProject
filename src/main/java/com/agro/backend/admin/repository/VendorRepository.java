package com.agro.backend.admin.repository;

import com.agro.backend.admin.model.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VendorRepository extends MongoRepository<Vendor, String> {

    List<Vendor> findByNameContainingIgnoreCase(String name);

    List<Vendor> findByStatusIgnoreCase(String status);

    List<Vendor> findByAddressContainingIgnoreCase(String address);
}
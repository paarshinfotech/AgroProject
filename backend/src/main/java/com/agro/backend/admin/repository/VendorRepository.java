package com.agro.backend.admin.repository;

import com.agro.backend.admin.model.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VendorRepository extends MongoRepository<Vendor, String> {

}
package com.agro.backend.admin.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.agro.backend.admin.model.Approval;

@Repository
public interface ApprovalRepository extends MongoRepository<Approval, String> {

    List<Approval> findByStatus(String status);

}
package com.agro.backend.admin.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.agro.backend.admin.model.Approval;
import com.agro.backend.admin.repository.ApprovalRepository;

@Service
public class ApprovalService {

    @Autowired
    private ApprovalRepository repository;

    // Create
    public Approval createApproval(Approval approval) {
        approval.setStatus("PENDING");
        return repository.save(approval);
    }

    // Get all
    public List<Approval> getAllApprovals() {
        return repository.findAll();
    }

    // Get by ID
    public Approval getApprovalById(String id) {
        Optional<Approval> approval = repository.findById(id);
        return approval.orElse(null);
    }

    // Get pending only
    public List<Approval> getPendingApprovals() {
        return repository.findByStatus("PENDING");
    }

    // Approve
    public Approval approveRequest(String id) {
        Approval approval = getApprovalById(id);
        if (approval != null) {
            approval.setStatus("APPROVED");
            return repository.save(approval);
        }
        return null;
    }

    // Reject
    public Approval rejectRequest(String id) {
        Approval approval = getApprovalById(id);
        if (approval != null) {
            approval.setStatus("REJECTED");
            return repository.save(approval);
        }
        return null;
    }

    // Delete
    public void deleteApproval(String id) {
        repository.deleteById(id);
    }
}
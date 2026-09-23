package com.agro.backend.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.agro.backend.admin.model.Approval;
import com.agro.backend.admin.repository.ApprovalRepository;

@Service
public class ApprovalService {

    private final ApprovalRepository approvalRepository;

    public ApprovalService(ApprovalRepository approvalRepository) {
        this.approvalRepository = approvalRepository;
    }

    // Get all approvals
    public List<Approval> getAllApprovals() {
        return approvalRepository.findAll();
    }

    // Get approval by ID
    public Approval getApprovalById(String id) {
        return approvalRepository.findById(id).orElse(null);
    }

    // Create new approval
    public Approval createApproval(Approval approval) {
        return approvalRepository.save(approval);
    }

    // Update approval status
    public Approval updateApprovalStatus(String id, String status) {

        Approval approval = approvalRepository.findById(id).orElse(null);

        if (approval == null) {
            return null;
        }

        approval.setStatus(status);

        return approvalRepository.save(approval);
    }

    // Delete approval
    public boolean deleteApproval(String id) {

        Approval approval = approvalRepository.findById(id).orElse(null);

        if (approval == null) {
            return false;
        }

        approvalRepository.deleteById(id);

        return true;
    }
}
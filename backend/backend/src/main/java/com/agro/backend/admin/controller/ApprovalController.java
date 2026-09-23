package com.agro.backend.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agro.backend.admin.model.Approval;
import com.agro.backend.admin.service.ApprovalService;

@RestController
@RequestMapping("/api/approvals")
@CrossOrigin(origins = "*")
public class ApprovalController {

    @Autowired
    private ApprovalService service;

    // Create approval request
    @PostMapping
    public Approval createApproval(@RequestBody Approval approval) {
        return service.createApproval(approval);
    }

    // Get all approvals
    @GetMapping
    public List<Approval> getAllApprovals() {
        return service.getAllApprovals();
    }

    // Get approval by ID
    @GetMapping("/{id}")
    public Approval getApprovalById(@PathVariable String id) {
        return service.getApprovalById(id);
    }

    // Get pending approvals
    @GetMapping("/pending")
    public List<Approval> getPendingApprovals() {
        return service.getPendingApprovals();
    }

    // Approve request
    @PutMapping("/{id}/approve")
    public Approval approveRequest(@PathVariable String id) {
        return service.approveRequest(id);
    }

    // Reject request
    @PutMapping("/{id}/reject")
    public Approval rejectRequest(@PathVariable String id) {
        return service.rejectRequest(id);
    }

    // Delete approval
    @DeleteMapping("/{id}")
    public String deleteApproval(@PathVariable String id) {
        service.deleteApproval(id);
        return "Approval deleted successfully!";
    }
}
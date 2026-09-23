package com.agro.backend.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
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

    private final ApprovalService approvalService;

    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    // ==========================================
    // GET ALL APPROVALS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Approval>> getAllApprovals() {

        List<Approval> approvals =
                approvalService.getAllApprovals();

        return ResponseEntity.ok(approvals);
    }

    // ==========================================
    // GET APPROVAL BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Approval> getApprovalById(
            @PathVariable String id) {

        Approval approval =
                approvalService.getApprovalById(id);

        if (approval == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(approval);
    }

    // ==========================================
    // CREATE APPROVAL
    // ==========================================

    @PostMapping
    public ResponseEntity<Approval> createApproval(
            @RequestBody Approval approval) {

        Approval createdApproval =
                approvalService.createApproval(approval);

        return ResponseEntity.ok(createdApproval);
    }

    // ==========================================
    // UPDATE APPROVAL STATUS
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<Approval> updateApprovalStatus(
            @PathVariable String id,
            @RequestBody Approval approvalRequest) {

        Approval updatedApproval =
                approvalService.updateApprovalStatus(
                        id,
                        approvalRequest.getStatus()
                );

        if (updatedApproval == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedApproval);
    }

    // ==========================================
    // DELETE APPROVAL
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApproval(
            @PathVariable String id) {

        boolean deleted =
                approvalService.deleteApproval(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
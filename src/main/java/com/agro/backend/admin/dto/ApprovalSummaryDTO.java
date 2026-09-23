package com.agro.backend.admin.dto;

public class ApprovalSummaryDTO {

    private long pendingVendor;
    private long pendingCustomer;

    public ApprovalSummaryDTO() {
    }

    public ApprovalSummaryDTO(long pendingVendor, long pendingCustomer) {
        this.pendingVendor = pendingVendor;
        this.pendingCustomer = pendingCustomer;
    }

    public long getPendingVendor() {
        return pendingVendor;
    }

    public void setPendingVendor(long pendingVendor) {
        this.pendingVendor = pendingVendor;
    }

    public long getPendingCustomer() {
        return pendingCustomer;
    }

    public void setPendingCustomer(long pendingCustomer) {
        this.pendingCustomer = pendingCustomer;
    }
}
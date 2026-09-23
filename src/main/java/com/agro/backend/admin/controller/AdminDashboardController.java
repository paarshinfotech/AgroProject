package com.agro.backend.admin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalCustomers", 0);
        dashboard.put("totalVendors", 0);
        dashboard.put("pendingApprovals", 0);
        dashboard.put("activeSubscriptions", 0);
        dashboard.put("totalRevenue", 0);

        return dashboard;
    }

    @GetMapping("/test")
    public String testDashboard() {
        return "Admin Dashboard Backend is working!";
    }
}
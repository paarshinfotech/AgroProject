package com.agro.backend.admin.controller;

import com.agro.backend.admin.model.Vendor;
import com.agro.backend.admin.repository.VendorRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/vendors")
@CrossOrigin(origins = "http://localhost:5173")
public class VendorController {

    private final VendorRepository vendorRepository;

    public VendorController(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    // Get all vendors / Search / Location / Status / Pagination
    @GetMapping
    public Map<String, Object> getAllVendors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        List<Vendor> vendors = vendorRepository.findAll();

        // Name filter
        if (search != null && !search.trim().isEmpty()) {
            vendors = vendors.stream()
                    .filter(vendor -> vendor.getName() != null
                            && vendor.getName().toLowerCase()
                            .contains(search.toLowerCase()))
                    .toList();
        }

        // Location filter
        if (location != null && !location.trim().isEmpty()) {
            vendors = vendors.stream()
                    .filter(vendor -> vendor.getAddress() != null
                            && vendor.getAddress().toLowerCase()
                            .contains(location.toLowerCase()))
                    .toList();
        }

        // Status filter
        if (status != null && !status.trim().isEmpty()) {
            vendors = vendors.stream()
                    .filter(vendor -> vendor.getStatus() != null
                            && vendor.getStatus().equalsIgnoreCase(status))
                    .toList();
        }

        // Pagination
        int totalElements = vendors.size();

        int totalPages = size > 0
                ? (int) Math.ceil((double) totalElements / size)
                : 0;

        int start = Math.min(page * size, totalElements);
        int end = Math.min(start + size, totalElements);

        List<Vendor> paginatedVendors = vendors.subList(start, end);

        // Response
        Map<String, Object> response = new HashMap<>();

        response.put("vendors", paginatedVendors);
        response.put("currentPage", page);
        response.put("totalPages", totalPages);
        response.put("totalElements", totalElements);
        response.put("pageSize", size);

        return response;
    }

    // Get vendor by ID
    @GetMapping("/{id}")
    public Vendor getVendorById(@PathVariable String id) {

        return vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    // Test API
    @GetMapping("/test")
    public String test() {

        return "Vendor API is working";
    }

    // Add new vendor
    @PostMapping
    public Vendor addVendor(@RequestBody Vendor vendor) {

        return vendorRepository.save(vendor);
    }

    // Update vendor
    @PutMapping("/{id}")
    public Vendor updateVendor(
            @PathVariable String id,
            @RequestBody Vendor vendor) {

        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        existingVendor.setName(vendor.getName());
        existingVendor.setEmail(vendor.getEmail());
        existingVendor.setMobile(vendor.getMobile());
        existingVendor.setBusinessName(vendor.getBusinessName());
        existingVendor.setAddress(vendor.getAddress());
        existingVendor.setStatus(vendor.getStatus());

        return vendorRepository.save(existingVendor);
    }

    // Delete vendor
    @DeleteMapping("/{id}")
    public String deleteVendor(@PathVariable String id) {

        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        vendorRepository.delete(existingVendor);

        return "Vendor deleted successfully";
    }

    // Update vendor status
    @PatchMapping("/{id}/status")
    public Vendor updateVendorStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {

        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        String status = request.get("status");

        existingVendor.setStatus(status);

        return vendorRepository.save(existingVendor);
    }
}
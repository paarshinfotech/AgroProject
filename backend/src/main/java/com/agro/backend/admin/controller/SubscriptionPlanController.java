package com.agro.backend.admin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.agro.backend.admin.model.SubscriptionPlan;
import com.agro.backend.admin.service.SubscriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscriptions/plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<SubscriptionPlan> createPlan(
            @RequestBody SubscriptionPlan plan,
            @RequestParam(required = false, defaultValue = "admin") String actor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.createPlan(plan, actor));
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionPlan>> getPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> getPlan(@PathVariable String id) {
        return ResponseEntity.ok(subscriptionService.getPlan(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> updatePlan(
            @PathVariable String id,
            @RequestBody SubscriptionPlan plan,
            @RequestParam(required = false, defaultValue = "admin") String actor) {
        return ResponseEntity.ok(subscriptionService.updatePlan(id, plan, actor));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SubscriptionPlan> updatePlanStatus(
            @PathVariable String id,
            @RequestParam boolean enabled,
            @RequestParam(required = false, defaultValue = "admin") String actor) {
        return ResponseEntity.ok(subscriptionService.updatePlanStatus(id, enabled, actor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> deletePlan(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "admin") String actor) {
        return ResponseEntity.ok(subscriptionService.deletePlan(id, actor));
    }
}


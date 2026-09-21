package com.agro.backend.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agro.backend.admin.model.Subscription;
import com.agro.backend.admin.service.SubscriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@RequestBody Subscription subscription) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subscriptionService.createSubscription(subscription));
    }

    @GetMapping
    public ResponseEntity<List<Subscription>> getSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(subscriptionService.getDashboard());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscription(@PathVariable String id) {
        return ResponseEntity.ok(subscriptionService.getSubscription(id));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Subscription> cancelSubscription(@PathVariable String id) {
        return ResponseEntity.ok(subscriptionService.cancelSubscription(id));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Subscription> activateSubscription(@PathVariable String id) {
        return ResponseEntity.ok(subscriptionService.activateSubscription(id));
    }
}

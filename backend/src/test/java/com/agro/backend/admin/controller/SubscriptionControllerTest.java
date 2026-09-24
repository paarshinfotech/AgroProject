package com.agro.backend.admin.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import com.agro.backend.admin.config.WebMvcConfig;
import com.agro.backend.admin.model.SubscriberType;
import com.agro.backend.admin.model.Subscription;
import com.agro.backend.admin.model.SubscriptionStatus;
import com.agro.backend.admin.service.SubscriptionService;

@WebMvcTest(SubscriptionController.class)
@Import(WebMvcConfig.class)
class SubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SubscriptionService subscriptionService;

    private Subscription sampleSubscription(SubscriptionStatus status) {
        return Subscription.builder()
                .id("sub-1")
                .subscriberId("user-1")
                .subscriberName("Farmer John")
                .subscriberType(SubscriberType.CUSTOMER)
                .planId("plan-1")
                .planName("Monthly Farm Care")
                .startDate(Instant.now())
                .endDate(Instant.now().plusSeconds(86400 * 30))
                .status(status)
                .amount(new BigDecimal("499"))
                .currency("INR")
                .build();
    }

    @Test
    void createSubscription_returns201() throws Exception {
        Subscription sub = sampleSubscription(SubscriptionStatus.ACTIVE);
        when(subscriptionService.createSubscription(any(Subscription.class))).thenReturn(sub);

        String json = """
                {
                  "subscriberId": "user-1",
                  "subscriberName": "Farmer John",
                  "subscriberType": "CUSTOMER",
                  "planId": "plan-1"
                }
                """;

        mockMvc.perform(post("/api/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("sub-1"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void getSubscriptions_returns200() throws Exception {
        when(subscriptionService.getAllSubscriptions()).thenReturn(List.of(sampleSubscription(SubscriptionStatus.ACTIVE)));

        mockMvc.perform(get("/api/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("sub-1"));
    }

    @Test
    void getSubscription_returns200() throws Exception {
        when(subscriptionService.getSubscription("sub-1")).thenReturn(sampleSubscription(SubscriptionStatus.ACTIVE));

        mockMvc.perform(get("/api/subscriptions/sub-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("sub-1"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void getDashboard_returns200() throws Exception {
        when(subscriptionService.getDashboard()).thenReturn(Map.of("totalSubscriptions", 5, "currency", "INR"));

        mockMvc.perform(get("/api/subscriptions/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSubscriptions").value(5))
                .andExpect(jsonPath("$.currency").value("INR"));
    }

    @Test
    void cancelSubscription_returns200() throws Exception {
        Subscription cancelled = sampleSubscription(SubscriptionStatus.CANCELLED);
        cancelled.setCancelledAt(Instant.now());
        when(subscriptionService.cancelSubscription("sub-1")).thenReturn(cancelled);

        mockMvc.perform(patch("/api/subscriptions/sub-1/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("sub-1"))
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    void activateSubscription_returns200() throws Exception {
        Subscription activated = sampleSubscription(SubscriptionStatus.ACTIVE);
        when(subscriptionService.activateSubscription("sub-1")).thenReturn(activated);

        mockMvc.perform(patch("/api/subscriptions/sub-1/activate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("sub-1"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void activateSubscription_notFound_returns404() throws Exception {
        when(subscriptionService.activateSubscription("missing"))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription not found"));

        mockMvc.perform(patch("/api/subscriptions/missing/activate"))
                .andExpect(status().isNotFound());
    }
}

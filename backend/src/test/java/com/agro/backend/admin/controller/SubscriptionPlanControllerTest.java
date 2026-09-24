package com.agro.backend.admin.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;

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
import com.agro.backend.admin.model.DurationUnit;
import com.agro.backend.admin.model.PlanStatus;
import com.agro.backend.admin.model.SubscriptionPlan;
import com.agro.backend.admin.service.SubscriptionService;

@WebMvcTest(SubscriptionPlanController.class)
@Import(WebMvcConfig.class)
class SubscriptionPlanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SubscriptionService subscriptionService;

    private static final String VALID_PLAN_JSON = """
            {
              "planName": "Premium",
              "duration": 1,
              "durationUnit": "MONTH",
              "price": 999,
              "currency": "INR",
              "enabled": true,
              "region": "ALL"
            }
            """;

    private SubscriptionPlan samplePlan() {
        return SubscriptionPlan.builder()
                .id("plan-1")
                .planName("Premium")
                .duration(1)
                .durationUnit(DurationUnit.MONTH)
                .price(new BigDecimal("999"))
                .currency("INR")
                .enabled(true)
                .status(PlanStatus.ACTIVE)
                .region("ALL")
                .build();
    }

    @Test
    void createPlan_returns201() throws Exception {
        when(subscriptionService.createPlan(any(), anyString())).thenReturn(samplePlan());

        mockMvc.perform(post("/api/subscriptions/plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_PLAN_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.planName").value("Premium"));
    }

    @Test
    void getPlan_notFound_returns404() throws Exception {
        when(subscriptionService.getPlan("missing"))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));

        mockMvc.perform(get("/api/subscriptions/plans/missing"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deactivatePlan_returns200() throws Exception {
        SubscriptionPlan deactivated = samplePlan();
        deactivated.setEnabled(false);
        deactivated.setStatus(PlanStatus.INACTIVE);
        when(subscriptionService.deletePlan("plan-1", "admin")).thenReturn(deactivated);

        mockMvc.perform(delete("/api/subscriptions/plans/plan-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false));
    }
}

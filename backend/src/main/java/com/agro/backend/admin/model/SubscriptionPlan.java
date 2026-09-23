package com.agro.backend.admin.model;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "subscription_plans")
@CompoundIndex(name = "idx_plan_name_region", def = "{'planName': 1, 'region': 1}", unique = true)
public class SubscriptionPlan {

    @Id
    private String id;

    private String planName;
    private String description;
    private Integer duration;
    private DurationUnit durationUnit;
    private BigDecimal price;
    private String currency;
    private Boolean enabled;
    private PlanStatus status;
    private String region;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    private String createdBy;
    private String updatedBy;
}

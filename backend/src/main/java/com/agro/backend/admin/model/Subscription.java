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
@Document(collection = "subscriptions")
@CompoundIndex(name = "idx_subscriber_status", def = "{'subscriberId': 1, 'status': 1}")
@CompoundIndex(name = "idx_plan_status", def = "{'planId': 1, 'status': 1}")
public class Subscription {

    @Id
    private String id;

    private String subscriberId;
    private String subscriberName;
    private SubscriberType subscriberType;
    private String planId;
    private String planName;
    private Instant startDate;
    private Instant endDate;
    private SubscriptionStatus status;
    private BigDecimal amount;
    private String currency;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    private Instant cancelledAt;
}

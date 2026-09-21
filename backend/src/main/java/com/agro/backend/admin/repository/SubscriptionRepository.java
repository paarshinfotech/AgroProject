package com.agro.backend.admin.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.agro.backend.admin.model.Subscription;
import com.agro.backend.admin.model.SubscriptionStatus;

public interface SubscriptionRepository extends MongoRepository<Subscription, String> {

    long countByStatus(SubscriptionStatus status);

    boolean existsBySubscriberIdAndPlanIdAndStatus(String subscriberId, String planId, SubscriptionStatus status);

    @Query("{ 'status': ?0, 'endDate': { $lt: ?1 } }")
    List<Subscription> findExpiredSubscriptions(SubscriptionStatus status, Instant now);
}

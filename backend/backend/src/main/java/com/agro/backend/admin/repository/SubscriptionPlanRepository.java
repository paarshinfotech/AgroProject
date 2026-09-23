package com.agro.backend.admin.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.agro.backend.admin.model.PlanStatus;
import com.agro.backend.admin.model.SubscriptionPlan;

public interface SubscriptionPlanRepository extends MongoRepository<SubscriptionPlan, String> {

    Optional<SubscriptionPlan> findByPlanNameAndRegion(String planName, String region);

    long countByStatus(PlanStatus status);
}

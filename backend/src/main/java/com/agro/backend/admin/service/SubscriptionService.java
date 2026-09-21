package com.agro.backend.admin.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.agro.backend.admin.model.DurationUnit;
import com.agro.backend.admin.model.PlanStatus;
import com.agro.backend.admin.model.SubscriberType;
import com.agro.backend.admin.model.Subscription;
import com.agro.backend.admin.model.SubscriptionPlan;
import com.agro.backend.admin.model.SubscriptionStatus;
import com.agro.backend.admin.repository.SubscriptionPlanRepository;
import com.agro.backend.admin.repository.SubscriptionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Value("${app.subscription.currency:INR}")
    private String currency = "INR";

    // ----------------- PLANS -----------------

    public SubscriptionPlan createPlan(SubscriptionPlan plan, String actor) {
        if (plan.getPlanName() == null || plan.getPlanName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Plan name is required");
        }
        if (planRepository.findByPlanNameAndRegion(plan.getPlanName(), plan.getRegion()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Plan already exists in this region");
        }

        plan.setEnabled(plan.getEnabled() == null || plan.getEnabled());
        plan.setStatus(Boolean.TRUE.equals(plan.getEnabled()) ? PlanStatus.ACTIVE : PlanStatus.INACTIVE);
        plan.setCreatedBy(actor);
        plan.setUpdatedBy(actor);
        return planRepository.save(plan);
    }

    public List<SubscriptionPlan> getAllPlans() {
        return planRepository.findAll();
    }

    public SubscriptionPlan getPlan(String id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found: " + id));
    }

    public SubscriptionPlan updatePlan(String id, SubscriptionPlan updated, String actor) {
        SubscriptionPlan plan = getPlan(id);
        if (updated.getPlanName() != null) plan.setPlanName(updated.getPlanName());
        if (updated.getDescription() != null) plan.setDescription(updated.getDescription());
        if (updated.getDuration() != null) plan.setDuration(updated.getDuration());
        if (updated.getDurationUnit() != null) plan.setDurationUnit(updated.getDurationUnit());
        if (updated.getPrice() != null) plan.setPrice(updated.getPrice());
        if (updated.getRegion() != null) plan.setRegion(updated.getRegion());
        plan.setUpdatedBy(actor);
        return planRepository.save(plan);
    }

    public SubscriptionPlan updatePlanStatus(String id, boolean enabled, String actor) {
        SubscriptionPlan plan = getPlan(id);
        plan.setEnabled(enabled);
        plan.setStatus(enabled ? PlanStatus.ACTIVE : PlanStatus.INACTIVE);
        plan.setUpdatedBy(actor);
        return planRepository.save(plan);
    }

    public SubscriptionPlan deletePlan(String id, String actor) {
        return updatePlanStatus(id, false, actor);
    }

    // ----------------- SUBSCRIPTIONS -----------------

    public Subscription createSubscription(Subscription sub) {
        if (sub.getSubscriberId() == null || sub.getPlanId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subscriber ID and Plan ID are required");
        }

        SubscriptionPlan plan = getPlan(sub.getPlanId());
        if (!Boolean.TRUE.equals(plan.getEnabled()) || plan.getStatus() != PlanStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Plan is not active");
        }

        if (subscriptionRepository.existsBySubscriberIdAndPlanIdAndStatus(sub.getSubscriberId(), plan.getId(), SubscriptionStatus.ACTIVE)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Subscriber already has an active subscription");
        }

        Instant now = Instant.now();
        sub.setPlanName(plan.getPlanName());
        sub.setAmount(plan.getPrice());
        sub.setCurrency(plan.getCurrency() != null ? plan.getCurrency() : currency);
        sub.setStatus(SubscriptionStatus.ACTIVE);
        sub.setStartDate(now);
        sub.setEndDate(calculateEndDate(now, plan.getDuration(), plan.getDurationUnit()));
        if (sub.getSubscriberType() == null) {
            sub.setSubscriberType(SubscriberType.CUSTOMER);
        }

        return subscriptionRepository.save(sub);
    }

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public Subscription getSubscription(String id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription not found: " + id));
    }

    public Subscription cancelSubscription(String id) {
        Subscription sub = getSubscription(id);
        if (sub.getStatus() == SubscriptionStatus.CANCELLED || sub.getStatus() == SubscriptionStatus.EXPIRED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subscription is already cancelled or expired");
        }
        sub.setStatus(SubscriptionStatus.CANCELLED);
        sub.setCancelledAt(Instant.now());
        return subscriptionRepository.save(sub);
    }

    public Subscription activateSubscription(String id) {
        Subscription sub = getSubscription(id);
        if (sub.getStatus() == SubscriptionStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subscription is already active");
        }

        SubscriptionPlan plan = getPlan(sub.getPlanId());
        if (!Boolean.TRUE.equals(plan.getEnabled()) || plan.getStatus() != PlanStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Plan is not active");
        }

        if (subscriptionRepository.existsBySubscriberIdAndPlanIdAndStatus(sub.getSubscriberId(), plan.getId(), SubscriptionStatus.ACTIVE)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Subscriber already has an active subscription");
        }

        Instant now = Instant.now();
        sub.setStatus(SubscriptionStatus.ACTIVE);
        sub.setStartDate(now);
        sub.setEndDate(calculateEndDate(now, plan.getDuration(), plan.getDurationUnit()));
        sub.setCancelledAt(null);
        return subscriptionRepository.save(sub);
    }

    @Scheduled(cron = "${app.subscription.expiration-cron:0 0 * * * *}")
    public int expireSubscriptions() {
        List<Subscription> expired = subscriptionRepository.findExpiredSubscriptions(SubscriptionStatus.ACTIVE, Instant.now());
        for (Subscription s : expired) {
            s.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(s);
        }
        if (!expired.isEmpty()) {
            log.info("Auto-expired {} subscriptions", expired.size());
        }
        return expired.size();
    }

    // ----------------- DASHBOARD -----------------

    public Map<String, Object> getDashboard() {
        Map<String, Object> map = new HashMap<>();
        map.put("totalPlans", planRepository.countByStatus(PlanStatus.ACTIVE));
        map.put("totalSubscriptions", subscriptionRepository.count());
        map.put("activeSubscribers", subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE));
        map.put("inactiveSubscribers", subscriptionRepository.countByStatus(SubscriptionStatus.EXPIRED)
                + subscriptionRepository.countByStatus(SubscriptionStatus.CANCELLED));

        BigDecimal totalRevenue = subscriptionRepository.findAll().stream()
                .map(Subscription::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        map.put("totalRevenue", totalRevenue);
        map.put("currency", currency);
        return map;
    }

    private Instant calculateEndDate(Instant start, Integer duration, DurationUnit unit) {
        int d = (duration != null && duration > 0) ? duration : 30;
        if (unit == null) return start.plus(d, ChronoUnit.DAYS);
        return switch (unit) {
            case DAY -> start.plus(d, ChronoUnit.DAYS);
            case MONTH -> start.atZone(ZoneOffset.UTC).plusMonths(d).toInstant();
            case YEAR -> start.atZone(ZoneOffset.UTC).plusYears(d).toInstant();
        };
    }
}

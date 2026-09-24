package com.agro.backend.admin.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.agro.backend.admin.model.DurationUnit;
import com.agro.backend.admin.model.PlanStatus;
import com.agro.backend.admin.model.SubscriberType;
import com.agro.backend.admin.model.Subscription;
import com.agro.backend.admin.model.SubscriptionPlan;
import com.agro.backend.admin.model.SubscriptionStatus;
import com.agro.backend.admin.repository.SubscriptionPlanRepository;
import com.agro.backend.admin.repository.SubscriptionRepository;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionPlanRepository planRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private SubscriptionPlan activePlan;

    @BeforeEach
    void setUp() {
        activePlan = SubscriptionPlan.builder()
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
    void createPlan_success() {
        when(planRepository.findByPlanNameAndRegion(anyString(), anyString())).thenReturn(Optional.empty());
        when(planRepository.save(any(SubscriptionPlan.class))).thenAnswer(inv -> inv.getArgument(0));

        SubscriptionPlan plan = SubscriptionPlan.builder()
                .planName("Premium")
                .duration(1)
                .durationUnit(DurationUnit.MONTH)
                .price(new BigDecimal("999"))
                .region("ALL")
                .build();

        SubscriptionPlan created = subscriptionService.createPlan(plan, "admin");

        assertThat(created.getPlanName()).isEqualTo("Premium");
        assertThat(created.getStatus()).isEqualTo(PlanStatus.ACTIVE);
    }

    @Test
    void createPlan_duplicate_throwsConflict() {
        when(planRepository.findByPlanNameAndRegion(anyString(), anyString()))
                .thenReturn(Optional.of(activePlan));

        SubscriptionPlan plan = SubscriptionPlan.builder()
                .planName("Premium")
                .duration(1)
                .price(new BigDecimal("999"))
                .region("ALL")
                .build();

        assertThatThrownBy(() -> subscriptionService.createPlan(plan, "admin"))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void getPlan_notFound_throwsNotFound() {
        when(planRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subscriptionService.getPlan("missing"))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void createSubscription_success() {
        when(planRepository.findById("plan-1")).thenReturn(Optional.of(activePlan));
        when(subscriptionRepository.existsBySubscriberIdAndPlanIdAndStatus(anyString(), anyString(), any()))
                .thenReturn(false);
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(inv -> inv.getArgument(0));

        Subscription req = Subscription.builder()
                .subscriberId("sub-1")
                .subscriberName("John")
                .subscriberType(SubscriberType.CUSTOMER)
                .planId("plan-1")
                .build();

        Subscription sub = subscriptionService.createSubscription(req);

        assertThat(sub.getStatus()).isEqualTo(SubscriptionStatus.ACTIVE);
        assertThat(sub.getAmount()).isEqualByComparingTo("999");
        assertThat(sub.getPlanName()).isEqualTo("Premium");
    }

    @Test
    void createSubscription_inactivePlan_throwsBadRequest() {
        activePlan.setEnabled(false);
        activePlan.setStatus(PlanStatus.INACTIVE);
        when(planRepository.findById("plan-1")).thenReturn(Optional.of(activePlan));

        Subscription req = Subscription.builder()
                .subscriberId("sub-1")
                .planId("plan-1")
                .build();

        assertThatThrownBy(() -> subscriptionService.createSubscription(req))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void cancelSubscription_success() {
        Subscription sub = Subscription.builder()
                .id("sub-1")
                .status(SubscriptionStatus.ACTIVE)
                .build();
        when(subscriptionRepository.findById("sub-1")).thenReturn(Optional.of(sub));
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(inv -> inv.getArgument(0));

        Subscription cancelled = subscriptionService.cancelSubscription("sub-1");

        assertThat(cancelled.getStatus()).isEqualTo(SubscriptionStatus.CANCELLED);
        assertThat(cancelled.getCancelledAt()).isNotNull();
    }

    @Test
    void activateSubscription_success() {
        Subscription sub = Subscription.builder()
                .id("sub-1")
                .subscriberId("sub-user-1")
                .planId("plan-1")
                .status(SubscriptionStatus.CANCELLED)
                .cancelledAt(Instant.now())
                .build();
        when(subscriptionRepository.findById("sub-1")).thenReturn(Optional.of(sub));
        when(planRepository.findById("plan-1")).thenReturn(Optional.of(activePlan));
        when(subscriptionRepository.existsBySubscriberIdAndPlanIdAndStatus("sub-user-1", "plan-1", SubscriptionStatus.ACTIVE))
                .thenReturn(false);
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(inv -> inv.getArgument(0));

        Subscription activated = subscriptionService.activateSubscription("sub-1");

        assertThat(activated.getStatus()).isEqualTo(SubscriptionStatus.ACTIVE);
        assertThat(activated.getCancelledAt()).isNull();
        assertThat(activated.getStartDate()).isNotNull();
        assertThat(activated.getEndDate()).isNotNull();
    }

    @Test
    void activateSubscription_alreadyActive_throwsBadRequest() {
        Subscription sub = Subscription.builder()
                .id("sub-1")
                .status(SubscriptionStatus.ACTIVE)
                .build();
        when(subscriptionRepository.findById("sub-1")).thenReturn(Optional.of(sub));

        assertThatThrownBy(() -> subscriptionService.activateSubscription("sub-1"))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void activateSubscription_conflict_throwsConflict() {
        Subscription sub = Subscription.builder()
                .id("sub-1")
                .subscriberId("sub-user-1")
                .planId("plan-1")
                .status(SubscriptionStatus.CANCELLED)
                .build();
        when(subscriptionRepository.findById("sub-1")).thenReturn(Optional.of(sub));
        when(planRepository.findById("plan-1")).thenReturn(Optional.of(activePlan));
        when(subscriptionRepository.existsBySubscriberIdAndPlanIdAndStatus("sub-user-1", "plan-1", SubscriptionStatus.ACTIVE))
                .thenReturn(true);

        assertThatThrownBy(() -> subscriptionService.activateSubscription("sub-1"))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void expireSubscriptions_success() {
        Subscription expired = Subscription.builder().id("s-1").status(SubscriptionStatus.ACTIVE).build();
        when(subscriptionRepository.findExpiredSubscriptions(eq(SubscriptionStatus.ACTIVE), any(Instant.class)))
                .thenReturn(List.of(expired));
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(inv -> inv.getArgument(0));

        int count = subscriptionService.expireSubscriptions();

        assertThat(count).isEqualTo(1);
        assertThat(expired.getStatus()).isEqualTo(SubscriptionStatus.EXPIRED);
    }

    @Test
    void getDashboard_aggregatesCorrectly() {
        when(planRepository.countByStatus(PlanStatus.ACTIVE)).thenReturn(3L);
        when(subscriptionRepository.count()).thenReturn(10L);
        when(subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE)).thenReturn(6L);
        when(subscriptionRepository.countByStatus(SubscriptionStatus.EXPIRED)).thenReturn(2L);
        when(subscriptionRepository.countByStatus(SubscriptionStatus.CANCELLED)).thenReturn(1L);
        when(subscriptionRepository.findAll()).thenReturn(List.of(
                Subscription.builder().amount(new BigDecimal("2997")).build()
        ));

        Map<String, Object> dashboard = subscriptionService.getDashboard();

        assertThat(dashboard.get("totalPlans")).isEqualTo(3L);
        assertThat(dashboard.get("totalSubscriptions")).isEqualTo(10L);
        assertThat(dashboard.get("activeSubscribers")).isEqualTo(6L);
        assertThat(dashboard.get("inactiveSubscribers")).isEqualTo(3L);
        assertThat((BigDecimal) dashboard.get("totalRevenue")).isEqualByComparingTo("2997");
    }
}

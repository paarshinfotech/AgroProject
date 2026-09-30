import React, { useEffect, useState, useMemo, useCallback } from "react";
import "../CSS/SubscriptionManagement.css";

const API_BASE_URL = "http://localhost:8080";

/* ----------------------------------------------------------------------------
   Inline SVG Icons
---------------------------------------------------------------------------- */
function RefreshIcon({ className = "" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
   Formatters & Helpers
---------------------------------------------------------------------------- */
function formatDate(dateValue) {
  if (!dateValue) return "-";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateValue);
  }
}

function formatCurrency(amount, currency = "INR") {
  if (amount == null) return "-";
  const num = Number(amount);
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₹";
  return `${symbol}${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getExpiryWarning(endDateStr) {
  if (!endDateStr) return null;
  const now = new Date();
  const end = new Date(endDateStr);
  const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `Expired ${Math.abs(diffDays)}d ago`, isExpired: true };
  }
  if (diffDays <= 7) {
    return { text: `Expires in ${diffDays} day${diffDays === 1 ? "" : "s"}!`, isWarning: true };
  }
  return { text: `Renews in ${diffDays} days`, isNormal: true };
}

/* ----------------------------------------------------------------------------
   Main Subscription Management Component
---------------------------------------------------------------------------- */
export default function SubscriptionManagement() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState("subscriptions"); // "subscriptions" | "plans" | "analytics"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterWrapperRef = React.useRef(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterWrapperRef.current && !filterWrapperRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const activeFilterCount = (statusFilter !== "All" ? 1 : 0) + (typeFilter !== "All" ? 1 : 0);

  // API Data States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalPlans: 0,
    totalSubscriptions: 0,
    activeSubscribers: 0,
    inactiveSubscribers: 0,
    totalRevenue: 0,
    currency: "INR",
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscribersList, setSubscribersList] = useState([]);

  // Modals & Dialogs
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    isDanger: false,
    onConfirm: () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Forms State
  const [newSubForm, setNewSubForm] = useState({
    subscriberType: "CUSTOMER",
    subscriberId: "",
    subscriberName: "",
    planId: "",
  });

  const [planForm, setPlanForm] = useState({
    planName: "",
    description: "",
    duration: 1,
    durationUnit: "MONTH",
    price: "",
    currency: "USD",
    region: "GLOBAL",
    enabled: true,
  });

  // ---------------------------------------------------------------------------
  // FETCH ALL DATA FROM API
  // ---------------------------------------------------------------------------
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      // 1. Dashboard summary
      const dashRes = await fetch(`${API_BASE_URL}/api/subscriptions/dashboard`);
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setDashboardStats(dashData);
        setIsApiConnected(true);
      }

      // 2. All subscriptions
      const subsRes = await fetch(`${API_BASE_URL}/api/subscriptions`);
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubscriptions(Array.isArray(subsData) ? subsData : []);
      }

      // 3. All plans
      const plansRes = await fetch(`${API_BASE_URL}/api/subscriptions/plans`);
      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(Array.isArray(plansData) ? plansData : []);
      }

      // 4. Try fetching customers for easy assign
      try {
        const custRes = await fetch(`${API_BASE_URL}/api/admin/customers-management?page=0&size=50`);
        if (custRes.ok) {
          const custData = await custRes.json();
          const items = custData.content || [];
          setSubscribersList(items);
        }
      } catch {
        // Optional
      }

      if (!isSilent) addToast("Data refreshed successfully", "success");
    } catch (err) {
      console.error("API error fetching subscriptions:", err);
      setIsApiConnected(false);
      addToast("Could not reach backend API at port 8080", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // ---------------------------------------------------------------------------
  // SUBSCRIPTION ACTIONS
  // ---------------------------------------------------------------------------
  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    if (!newSubForm.subscriberId || !newSubForm.planId) {
      addToast("Please fill in Subscriber ID and select a Plan", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubForm),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create subscription");
      }

      const created = await res.json();
      addToast(`Subscription activated for ${created.subscriberName || created.subscriberId}`, "success");
      setIsNewSubModalOpen(false);
      setNewSubForm({
        subscriberType: "CUSTOMER",
        subscriberId: "",
        subscriberName: "",
        planId: "",
      });
      fetchData(true);
    } catch (err) {
      addToast(err.message || "Error creating subscription", "error");
    }
  };

  const handleCancelSubscription = (sub) => {
    setConfirmDialog({
      isOpen: true,
      title: "Cancel Subscription",
      message: `Are you sure you want to cancel the subscription for ${sub.subscriberName || sub.subscriberId}? They will lose active benefits immediately.`,
      confirmText: "Yes, Cancel Subscription",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/subscriptions/${sub.id}/cancel`, {
            method: "PATCH",
          });
          if (!res.ok) throw new Error("Failed to cancel subscription");
          addToast("Subscription cancelled successfully", "success");
          fetchData(true);
        } catch (err) {
          addToast(err.message, "error");
        } finally {
          setConfirmDialog((p) => ({ ...p, isOpen: false }));
        }
      },
    });
  };

  const handleActivateSubscription = async (sub) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/subscriptions/${sub.id}/activate`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to activate subscription");
      addToast("Subscription re-activated successfully", "success");
      fetchData(true);
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  // ---------------------------------------------------------------------------
  // PLAN ACTIONS
  // ---------------------------------------------------------------------------
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planForm.planName) {
      addToast("Plan name is required", "error");
      return;
    }

    try {
      const payload = {
        ...planForm,
        duration: Number(planForm.duration),
        price: Number(planForm.price) || 0,
      };

      const res = await fetch(`${API_BASE_URL}/api/subscriptions/plans?actor=admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create plan");
      }

      addToast(`Plan "${planForm.planName}" created successfully!`, "success");
      setIsNewPlanModalOpen(false);
      setPlanForm({
        planName: "",
        description: "",
        duration: 1,
        durationUnit: "MONTH",
        price: "",
        currency: "USD",
        region: "GLOBAL",
        enabled: true,
      });
      fetchData(true);
    } catch (err) {
      addToast(err.message || "Error creating plan", "error");
    }
  };

  const handleOpenEditPlan = (plan) => {
    setSelectedPlan(plan);
    setPlanForm({
      planName: plan.planName || "",
      description: plan.description || "",
      duration: plan.duration ?? 1,
      durationUnit: plan.durationUnit || "MONTH",
      price: plan.price ?? 0,
      currency: plan.currency || "USD",
      region: plan.region || "GLOBAL",
      enabled: plan.enabled ?? true,
    });
    setIsEditPlanModalOpen(true);
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      const payload = {
        ...planForm,
        duration: Number(planForm.duration),
        price: Number(planForm.price) || 0,
      };

      const res = await fetch(`${API_BASE_URL}/api/subscriptions/plans/${selectedPlan.id}?actor=admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update plan");

      addToast(`Plan "${planForm.planName}" updated!`, "success");
      setIsEditPlanModalOpen(false);
      setSelectedPlan(null);
      fetchData(true);
    } catch (err) {
      addToast(err.message || "Error updating plan", "error");
    }
  };

  const handleTogglePlanStatus = async (plan, e) => {
    e.stopPropagation();
    const newStatus = !plan.enabled;
    try {
      const res = await fetch(`${API_BASE_URL}/api/subscriptions/plans/${plan.id}/status?enabled=${newStatus}&actor=admin`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to change plan status");

      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, enabled: newStatus, status: newStatus ? "ACTIVE" : "INACTIVE" } : p))
      );
      addToast(`Plan ${plan.planName} is now ${newStatus ? "ACTIVE" : "INACTIVE"}`, "info");
      fetchData(true);
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const handleDeletePlan = (plan) => {
    setConfirmDialog({
      isOpen: true,
      title: "Disable / Delete Plan",
      message: `Are you sure you want to deactivate "${plan.planName}"? Existing subscribers will retain their plans, but no new members will be able to subscribe to it.`,
      confirmText: "Yes, Disable Plan",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/subscriptions/plans/${plan.id}?actor=admin`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to disable plan");
          addToast(`Plan "${plan.planName}" disabled`, "info");
          fetchData(true);
        } catch (err) {
          addToast(err.message, "error");
        } finally {
          setConfirmDialog((p) => ({ ...p, isOpen: false }));
        }
      },
    });
  };

  // ---------------------------------------------------------------------------
  // FILTERED SUBSCRIPTIONS
  // ---------------------------------------------------------------------------
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const sQuery = search.toLowerCase();
      const matchSearch =
        !search ||
        (sub.subscriberName && sub.subscriberName.toLowerCase().includes(sQuery)) ||
        (sub.subscriberId && sub.subscriberId.toLowerCase().includes(sQuery)) ||
        (sub.planName && sub.planName.toLowerCase().includes(sQuery)) ||
        (sub.id && sub.id.toLowerCase().includes(sQuery));

      const matchStatus = statusFilter === "All" || sub.status === statusFilter;
      const matchType = typeFilter === "All" || sub.subscriberType === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [subscriptions, search, statusFilter, typeFilter]);

  // Selected plan in new subscription modal preview
  const selectedPlanDetails = useMemo(() => {
    return plans.find((p) => p.id === newSubForm.planId);
  }, [plans, newSubForm.planId]);

  return (
    <div className="sub-container">
      {/* =========================================================================
         PAGE HEADER
      ========================================================================= */}
      <div className="sub-header">
        <div className="sub-header__title-group">
          <h1 className="sub-header__title">Subscription Management</h1>
          <p className="sub-header__subtitle">
            Manage customer & vendor recurring billing, membership tiers, and subscription revenue
          </p>
        </div>

        <div className="sub-header__actions">
          <button
            type="button"
            className="sub-btn sub-btn--secondary"
            onClick={() => fetchData(false)}
            disabled={refreshing}
            title="Refresh from API"
          >
            <RefreshIcon className={refreshing ? "sub-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            className="sub-btn sub-btn--secondary"
            onClick={() => {
              setPlanForm({
                planName: "",
                description: "",
                duration: 1,
                durationUnit: "MONTH",
                price: "",
                currency: "USD",
                region: "GLOBAL",
                enabled: true,
              });
              setIsNewPlanModalOpen(true);
            }}
          >
            <LayersIcon />
            <span>New Plan</span>
          </button>

          <button
            type="button"
            className="sub-btn sub-btn--primary"
            onClick={() => {
              setNewSubForm({
                subscriberType: "CUSTOMER",
                subscriberId: "",
                subscriberName: "",
                planId: plans.length > 0 ? plans[0].id : "",
              });
              setIsNewSubModalOpen(true);
            }}
          >
            <PlusIcon />
            <span>New Subscription</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
         KPI STAT CARDS
      ========================================================================= */}
      <div className="sub-stats-grid">
        {/* Total Subscriptions */}
        <div className="sub-stat-card">
          <div className="sub-stat-card__top">
            <span className="sub-stat-card__label">Total Subscriptions</span>
            <div className="sub-stat-card__icon-wrap sub-stat-card__icon-wrap--sky">
              <UsersIcon />
            </div>
          </div>
          <div className="sub-stat-card__value">{dashboardStats.totalSubscriptions ?? subscriptions.length}</div>
          <div className="sub-stat-card__footer">
            <span className="sub-badge-pill sub-badge-pill--blue">All Time</span>
            <span>Recorded member subscriptions</span>
          </div>
        </div>

        {/* Active Subscribers */}
        <div className="sub-stat-card">
          <div className="sub-stat-card__top">
            <span className="sub-stat-card__label">Active Subscribers</span>
            <div className="sub-stat-card__icon-wrap sub-stat-card__icon-wrap--emerald">
              <CheckCircleIcon />
            </div>
          </div>
          <div className="sub-stat-card__value">{dashboardStats.activeSubscribers ?? 0}</div>
          <div className="sub-stat-card__footer">
            <span className="sub-badge-pill sub-badge-pill--green">Live Active</span>
            <span>Generating recurring value</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="sub-stat-card">
          <div className="sub-stat-card__top">
            <span className="sub-stat-card__label">Total Revenue</span>
            <div className="sub-stat-card__icon-wrap sub-stat-card__icon-wrap--amber">
              <RevenueIcon />
            </div>
          </div>
          <div className="sub-stat-card__value">
            {formatCurrency(dashboardStats.totalRevenue, dashboardStats.currency || "USD")}
          </div>
          <div className="sub-stat-card__footer">
            <span className="sub-badge-pill sub-badge-pill--orange">Accrued</span>
            <span>Total subscription earnings</span>
          </div>
        </div>

        {/* Active Plans */}
        <div className="sub-stat-card">
          <div className="sub-stat-card__top">
            <span className="sub-stat-card__label">Plan Catalog</span>
            <div className="sub-stat-card__icon-wrap sub-stat-card__icon-wrap--indigo">
              <LayersIcon />
            </div>
          </div>
          <div className="sub-stat-card__value">{dashboardStats.totalPlans ?? plans.length}</div>
          <div className="sub-stat-card__footer">
            <span className="sub-badge-pill sub-badge-pill--purple">Tiers Active</span>
            <span>Available pricing packages</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
         TABS NAVIGATION
      ========================================================================= */}
      <div className="sub-tabs-wrapper">
        <div className="sub-tabs">
          <button
            type="button"
            className={`sub-tab-btn ${activeTab === "subscriptions" ? "sub-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("subscriptions")}
          >
            <span>Subscriptions</span>
            <span className="sub-tab-count">{subscriptions.length}</span>
          </button>

          <button
            type="button"
            className={`sub-tab-btn ${activeTab === "plans" ? "sub-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("plans")}
          >
            <span>Plans & Pricing</span>
            <span className="sub-tab-count">{plans.length}</span>
          </button>

          <button
            type="button"
            className={`sub-tab-btn ${activeTab === "analytics" ? "sub-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <span>Revenue & Analytics</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
         TAB 1: SUBSCRIPTIONS LIST
      ========================================================================= */}
      {activeTab === "subscriptions" && (
        <>
          {/* TOOLBAR */}
          <div className="sub-toolbar">
            <div className="sub-toolbar__left">
              <div className="sub-search-box">
                <span className="sub-search-box__icon">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  className="sub-search-box__input"
                  placeholder="Search subscriber, ID, plan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button type="button" className="sub-search-box__clear" onClick={() => setSearch("")}>
                    <CloseIcon />
                  </button>
                )}
              </div>

              {/* Filter Button (Click to open, NOT hover) */}
              <div className="sub-filter-wrapper" ref={filterWrapperRef}>
                <button
                  type="button"
                  className={`sub-btn sub-btn--secondary sub-filter-btn ${activeFilterCount > 0 ? "sub-filter-btn--active" : ""}`}
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  aria-expanded={isFilterOpen}
                  title="Filter subscriptions"
                >
                  <FilterIcon />
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="sub-filter-badge">{activeFilterCount}</span>
                  )}
                </button>

                {isFilterOpen && (
                  <div className="sub-filter-dropdown" role="dialog" aria-label="Filter options">
                    <div className="sub-filter-dropdown__header">
                      <span className="sub-filter-dropdown__title">Filter Subscriptions</span>
                      <button
                        type="button"
                        className="sub-filter-dropdown__close"
                        onClick={() => setIsFilterOpen(false)}
                        aria-label="Close filters"
                      >
                        <CloseIcon />
                      </button>
                    </div>

                    <div className="sub-filter-dropdown__body">
                      <div className="sub-filter-field">
                        <label className="sub-filter-label">Subscription Status</label>
                        <select
                          className="sub-filter-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="All">All Statuses</option>
                          <option value="ACTIVE">Active</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="EXPIRED">Expired</option>
                        </select>
                      </div>

                      <div className="sub-filter-field">
                        <label className="sub-filter-label">Subscriber Role</label>
                        <select
                          className="sub-filter-select"
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                        >
                          <option value="All">All Types</option>
                          <option value="CUSTOMER">Customer</option>
                          <option value="VENDOR">Vendor</option>
                        </select>
                      </div>
                    </div>

                    <div className="sub-filter-dropdown__footer">
                      <button
                        type="button"
                        className="sub-btn sub-btn--secondary sub-btn--sm"
                        onClick={() => {
                          setStatusFilter("All");
                          setTypeFilter("All");
                        }}
                        disabled={activeFilterCount === 0}
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className="sub-btn sub-btn--primary sub-btn--sm"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filter Chips */}
              {activeFilterCount > 0 && (
                <div className="sub-active-chips">
                  {statusFilter !== "All" && (
                    <span className="sub-chip">
                      Status: <strong>{statusFilter}</strong>
                      <button
                        type="button"
                        className="sub-chip__remove"
                        onClick={() => setStatusFilter("All")}
                        title="Remove status filter"
                      >
                        <CloseIcon />
                      </button>
                    </span>
                  )}
                  {typeFilter !== "All" && (
                    <span className="sub-chip">
                      Type: <strong>{typeFilter}</strong>
                      <button
                        type="button"
                        className="sub-chip__remove"
                        onClick={() => setTypeFilter("All")}
                        title="Remove type filter"
                      >
                        <CloseIcon />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    className="sub-chip-clear"
                    onClick={() => {
                      setStatusFilter("All");
                      setTypeFilter("All");
                    }}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            <div className="sub-toolbar__right">
              <span style={{ fontSize: "13px", color: "var(--sub-text-muted)" }}>
                Showing <strong>{filteredSubscriptions.length}</strong> of {subscriptions.length} subscriptions
              </span>
            </div>
          </div>

          {/* SUBSCRIPTIONS TABLE */}
          <div className="sub-table-card">
            <div className="sub-table-responsive">
              <table className="sub-table">
                <thead>
                  <tr>
                    <th>Subscriber</th>
                    <th>Type</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                          <RefreshIcon className="sub-spin" />
                          <span>Loading subscriptions from database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="8">
                        <div className="sub-empty-state">
                          <div className="sub-empty-state__icon">
                            <UsersIcon />
                          </div>
                          <h3 className="sub-empty-state__title">No subscriptions found</h3>
                          <p className="sub-empty-state__desc">
                            {search || statusFilter !== "All" || typeFilter !== "All"
                              ? "Try adjusting your search criteria or filters."
                              : "No subscriptions have been registered yet."}
                          </p>
                          <button
                            type="button"
                            className="sub-btn sub-btn--primary sub-btn--sm"
                            onClick={() => setIsNewSubModalOpen(true)}
                          >
                            <PlusIcon />
                            <span>Create First Subscription</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((sub) => {
                      const expiry = getExpiryWarning(sub.endDate);
                      const isCustomer = sub.subscriberType === "CUSTOMER";

                      return (
                        <tr key={sub.id}>
                          {/* Subscriber */}
                          <td>
                            <div className="sub-subscriber-cell">
                              <div className={`sub-avatar ${isCustomer ? "sub-avatar--customer" : "sub-avatar--vendor"}`}>
                                {(sub.subscriberName || sub.subscriberId || "U").charAt(0).toUpperCase()}
                              </div>
                              <div className="sub-subscriber-info">
                                <span className="sub-subscriber-name">{sub.subscriberName || "Unnamed Subscriber"}</span>
                                <div className="sub-subscriber-meta">
                                  <span className="sub-id-code">{sub.subscriberId}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Type */}
                          <td>
                            <span className={`sub-type-badge ${isCustomer ? "sub-type-badge--customer" : "sub-type-badge--vendor"}`}>
                              {sub.subscriberType}
                            </span>
                          </td>

                          {/* Plan */}
                          <td>
                            <span className="sub-plan-badge">
                              <LayersIcon />
                              <span>{sub.planName || "Custom Plan"}</span>
                            </span>
                          </td>

                          {/* Amount */}
                          <td>
                            <span className="sub-price-tag">{formatCurrency(sub.amount, sub.currency)}</span>
                          </td>

                          {/* Start Date */}
                          <td>
                            <div className="sub-date-display">
                              <span>{formatDate(sub.startDate)}</span>
                            </div>
                          </td>

                          {/* End Date */}
                          <td>
                            <div className="sub-date-display">
                              <span>{formatDate(sub.endDate)}</span>
                              {expiry && sub.status === "ACTIVE" && (
                                <span
                                  className={`sub-date-subtext ${
                                    expiry.isExpired
                                      ? "sub-date-subtext--expired"
                                      : expiry.isWarning
                                      ? "sub-date-subtext--warning"
                                      : ""
                                  }`}
                                >
                                  {expiry.text}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td>
                            <span
                              className={`sub-status-pill ${
                                sub.status === "ACTIVE"
                                  ? "sub-status-pill--active"
                                  : sub.status === "CANCELLED"
                                  ? "sub-status-pill--cancelled"
                                  : "sub-status-pill--expired"
                              }`}
                            >
                              <span className="sub-status-pill__dot" />
                              <span>{sub.status}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td>
                            <div className="sub-actions-cell" style={{ justifyContent: "flex-end" }}>
                              <button
                                type="button"
                                className="sub-action-btn"
                                title="View Details"
                                onClick={() => setSelectedSubscription(sub)}
                              >
                                <EyeIcon />
                              </button>

                              {sub.status === "ACTIVE" ? (
                                <button
                                  type="button"
                                  className="sub-action-btn sub-action-btn--danger"
                                  title="Cancel Subscription"
                                  onClick={() => handleCancelSubscription(sub)}
                                >
                                  <CancelIcon />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="sub-action-btn sub-action-btn--success"
                                  title="Re-activate Subscription"
                                  onClick={() => handleActivateSubscription(sub)}
                                >
                                  <CheckIcon />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
         TAB 2: PLANS & PRICING
      ========================================================================= */}
      {activeTab === "plans" && (
        <div>
          <div className="sub-plans-header">
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Membership Plans Catalog</h2>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--sub-text-muted)" }}>
                Active plans can be subscribed by farmers, customers, and vendor partners.
              </p>
            </div>
            <button
              type="button"
              className="sub-btn sub-btn--primary"
              onClick={() => {
                setPlanForm({
                  planName: "",
                  description: "",
                  duration: 1,
                  durationUnit: "MONTH",
                  price: "",
                  currency: "USD",
                  region: "GLOBAL",
                  enabled: true,
                });
                setIsNewPlanModalOpen(true);
              }}
            >
              <PlusIcon />
              <span>Create New Plan</span>
            </button>
          </div>

          <div className="sub-plans-grid">
            {plans.map((plan) => {
              const activeSubsOnPlan = subscriptions.filter(
                (s) => s.planId === plan.id && s.status === "ACTIVE"
              ).length;

              return (
                <div
                  key={plan.id}
                  className={`sub-plan-card ${!plan.enabled ? "sub-plan-card--inactive" : ""}`}
                >
                  <div>
                    <div className="sub-plan-card__top">
                      <div className="sub-plan-card__title-group">
                        <span className="sub-plan-card__region">{plan.region || "Global"}</span>
                        <h3 className="sub-plan-card__title">{plan.planName}</h3>
                      </div>
                      <span
                        className={`sub-status-pill ${
                          plan.enabled ? "sub-status-pill--active" : "sub-status-pill--expired"
                        }`}
                      >
                        <span className="sub-status-pill__dot" />
                        <span>{plan.enabled ? "ACTIVE" : "INACTIVE"}</span>
                      </span>
                    </div>

                    <div className="sub-plan-card__price-box">
                      <span className="sub-plan-card__price">
                        {formatCurrency(plan.price, plan.currency || "USD")}
                      </span>
                      <span className="sub-plan-card__period">
                        / {plan.duration} {plan.durationUnit?.toLowerCase()}
                        {plan.duration > 1 ? "s" : ""}
                      </span>
                    </div>

                    <p className="sub-plan-card__desc">
                      {plan.description || "Comprehensive agricultural plan with recurring access."}
                    </p>

                    <ul className="sub-plan-card__perks">
                      <li className="sub-plan-card__perk-item">
                        <span className="sub-plan-card__check">✓</span>
                        <span>Full advisory & crop health services</span>
                      </li>
                      <li className="sub-plan-card__perk-item">
                        <span className="sub-plan-card__check">✓</span>
                        <span>Verified vendor marketplace access</span>
                      </li>
                      <li className="sub-plan-card__perk-item">
                        <span className="sub-plan-card__check">✓</span>
                        <span>Priority support & notifications</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div style={{ marginBottom: "14px", fontSize: "12.5px", color: "var(--sub-text-muted)" }}>
                      Active subscribers on this tier: <strong>{activeSubsOnPlan}</strong>
                    </div>

                    <div className="sub-plan-card__footer">
                      <label className="sub-toggle-wrapper">
                        <span className="sub-switch">
                          <input
                            type="checkbox"
                            checked={!!plan.enabled}
                            onChange={(e) => handleTogglePlanStatus(plan, e)}
                          />
                          <span className="sub-slider" />
                        </span>
                        <span>{plan.enabled ? "Enabled" : "Disabled"}</span>
                      </label>

                      <div className="sub-plan-card__actions">
                        <button
                          type="button"
                          className="sub-action-btn"
                          title="Edit Plan"
                          onClick={() => handleOpenEditPlan(plan)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className="sub-action-btn sub-action-btn--danger"
                          title="Disable / Delete Plan"
                          onClick={() => handleDeletePlan(plan)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* "+ Create New Plan" Card */}
            <div
              className="sub-plan-card sub-plan-card--new"
              onClick={() => {
                setPlanForm({
                  planName: "",
                  description: "",
                  duration: 1,
                  durationUnit: "MONTH",
                  price: "",
                  currency: "USD",
                  region: "GLOBAL",
                  enabled: true,
                });
                setIsNewPlanModalOpen(true);
              }}
            >
              <div className="sub-plan-card--new__icon">
                <PlusIcon />
              </div>
              <h4 className="sub-plan-card--new__title">Add New Tier</h4>
              <p className="sub-plan-card--new__desc">
                Introduce a new membership package for farmers or vendors
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB 3: REVENUE & ANALYTICS
      ========================================================================= */}
      {activeTab === "analytics" && (
        <div className="sub-analytics-grid">
          {/* Revenue by Plan */}
          <div className="sub-analytics-card">
            <h3 className="sub-analytics-card__title">Revenue by Plan</h3>
            <p className="sub-analytics-card__desc">Distribution of revenue generated across plan packages</p>

            <div className="sub-bars-list">
              {plans.map((plan) => {
                const planSubs = subscriptions.filter((s) => s.planId === plan.id);
                const planRev = planSubs.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                const totalRev = Number(dashboardStats.totalRevenue) || 1;
                const pct = Math.min(100, Math.round((planRev / totalRev) * 100));

                return (
                  <div key={plan.id} className="sub-bar-item">
                    <div className="sub-bar-item__header">
                      <span>{plan.planName}</span>
                      <span>
                        {formatCurrency(planRev, plan.currency || "USD")} ({pct}%)
                      </span>
                    </div>
                    <div className="sub-bar-track">
                      <div className="sub-bar-fill sub-bar-fill--emerald" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscriber Breakdown */}
          <div className="sub-analytics-card">
            <h3 className="sub-analytics-card__title">Subscriber Types Breakdown</h3>
            <p className="sub-analytics-card__desc">Proportion of Customer vs Vendor accounts</p>

            {(() => {
              const customerCount = subscriptions.filter((s) => s.subscriberType === "CUSTOMER").length;
              const vendorCount = subscriptions.filter((s) => s.subscriberType === "VENDOR").length;
              const total = subscriptions.length || 1;
              const custPct = Math.round((customerCount / total) * 100);
              const vendPct = Math.round((vendorCount / total) * 100);

              return (
                <div className="sub-bars-list">
                  <div className="sub-bar-item">
                    <div className="sub-bar-item__header">
                      <span>Customer Subscriptions ({customerCount})</span>
                      <span>{custPct}%</span>
                    </div>
                    <div className="sub-bar-track">
                      <div className="sub-bar-fill sub-bar-fill--sky" style={{ width: `${custPct}%` }} />
                    </div>
                  </div>

                  <div className="sub-bar-item">
                    <div className="sub-bar-item__header">
                      <span>Vendor Subscriptions ({vendorCount})</span>
                      <span>{vendPct}%</span>
                    </div>
                    <div className="sub-bar-track">
                      <div className="sub-bar-fill sub-bar-fill--indigo" style={{ width: `${vendPct}%` }} />
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      padding: "16px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "10px",
                      border: "1px solid #e5e5e5",
                      display: "flex",
                      justifyContent: "space-around",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "22px", fontWeight: "800", color: "#111111" }}>{customerCount}</div>
                      <div style={{ fontSize: "12px", color: "var(--sub-text-muted)" }}>Customers</div>
                    </div>
                    <div style={{ borderRight: "1px solid #e5e5e5" }} />
                    <div>
                      <div style={{ fontSize: "22px", fontWeight: "800", color: "#111111" }}>{vendorCount}</div>
                      <div style={{ fontSize: "12px", color: "var(--sub-text-muted)" }}>Vendors</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 1: ASSIGN / CREATE NEW SUBSCRIPTION
      ========================================================================= */}
      {isNewSubModalOpen && (
        <div className="sub-modal-backdrop" onClick={() => setIsNewSubModalOpen(false)}>
          <div className="sub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sub-modal__header">
              <div className="sub-modal__title-group">
                <h3 className="sub-modal__title">Assign New Subscription</h3>
                <p className="sub-modal__subtitle">Activate a membership plan for a customer or vendor</p>
              </div>
              <button
                type="button"
                className="sub-modal__close-btn"
                onClick={() => setIsNewSubModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleCreateSubscription}>
              <div className="sub-modal__body">
                {/* Subscriber Type */}
                <div className="sub-form-group">
                  <label className="sub-label">Subscriber Role</label>
                  <div className="sub-radio-group">
                    <div
                      className={`sub-radio-card ${
                        newSubForm.subscriberType === "CUSTOMER" ? "sub-radio-card--selected" : ""
                      }`}
                      onClick={() => setNewSubForm((p) => ({ ...p, subscriberType: "CUSTOMER" }))}
                    >
                      <input
                        type="radio"
                        name="subscriberType"
                        checked={newSubForm.subscriberType === "CUSTOMER"}
                        onChange={() => {}}
                      />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "13px" }}>Customer / Farmer</div>
                        <div style={{ fontSize: "11px", color: "var(--sub-text-muted)" }}>End-consumer / grower</div>
                      </div>
                    </div>

                    <div
                      className={`sub-radio-card ${
                        newSubForm.subscriberType === "VENDOR" ? "sub-radio-card--selected" : ""
                      }`}
                      onClick={() => setNewSubForm((p) => ({ ...p, subscriberType: "VENDOR" }))}
                    >
                      <input
                        type="radio"
                        name="subscriberType"
                        checked={newSubForm.subscriberType === "VENDOR"}
                        onChange={() => {}}
                      />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "13px" }}>Vendor Partner</div>
                        <div style={{ fontSize: "11px", color: "var(--sub-text-muted)" }}>Distributor / Supplier</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscriber Quick-pick or ID */}
                <div className="sub-form-group">
                  <label className="sub-label">
                    <span>Subscriber ID / Code</span>
                    <span className="sub-label-hint">e.g. CUST-0028 or VEND-005</span>
                  </label>

                  {subscribersList.length > 0 && newSubForm.subscriberType === "CUSTOMER" ? (
                    <select
                      className="sub-select"
                      value={newSubForm.subscriberId}
                      onChange={(e) => {
                        const sel = subscribersList.find((c) => c.customerId === e.target.value);
                        setNewSubForm((p) => ({
                          ...p,
                          subscriberId: e.target.value,
                          subscriberName: sel ? sel.name : p.subscriberName,
                        }));
                      }}
                      required
                    >
                      <option value="">-- Choose from existing customers or type below --</option>
                      {subscribersList.map((c) => (
                        <option key={c.id || c.customerId} value={c.customerId}>
                          {c.customerId} - {c.name} ({c.location || "General"})
                        </option>
                      ))}
                    </select>
                  ) : null}

                  <input
                    type="text"
                    className="sub-input"
                    placeholder="Enter unique subscriber ID"
                    value={newSubForm.subscriberId}
                    onChange={(e) => setNewSubForm((p) => ({ ...p, subscriberId: e.target.value }))}
                    required
                  />
                </div>

                {/* Subscriber Name */}
                <div className="sub-form-group">
                  <label className="sub-label">Subscriber Full Name</label>
                  <input
                    type="text"
                    className="sub-input"
                    placeholder="e.g. Ramesh Patil"
                    value={newSubForm.subscriberName}
                    onChange={(e) => setNewSubForm((p) => ({ ...p, subscriberName: e.target.value }))}
                    required
                  />
                </div>

                {/* Plan Selection */}
                <div className="sub-form-group">
                  <label className="sub-label">Membership Plan Tier</label>
                  <select
                    className="sub-select"
                    value={newSubForm.planId}
                    onChange={(e) => setNewSubForm((p) => ({ ...p, planId: e.target.value }))}
                    required
                  >
                    <option value="">-- Select an active plan --</option>
                    {plans
                      .filter((p) => p.enabled)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.planName} ({formatCurrency(p.price, p.currency)} / {p.duration}{" "}
                          {p.durationUnit?.toLowerCase()})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Plan Preview */}
                {selectedPlanDetails && (
                  <div className="sub-plan-preview-box">
                    <div className="sub-plan-preview-box__title">Order Summary</div>
                    <div className="sub-preview-row">
                      <span>Selected Plan:</span>
                      <strong>{selectedPlanDetails.planName}</strong>
                    </div>
                    <div className="sub-preview-row">
                      <span>Duration:</span>
                      <span>
                        {selectedPlanDetails.duration} {selectedPlanDetails.durationUnit}
                      </span>
                    </div>
                    <div className="sub-preview-row">
                      <span>Region:</span>
                      <span>{selectedPlanDetails.region || "Global"}</span>
                    </div>
                    <div className="sub-preview-row sub-preview-row--bold">
                      <span>Billing Total:</span>
                      <span>
                        {formatCurrency(selectedPlanDetails.price, selectedPlanDetails.currency || "USD")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="sub-modal__footer">
                <button
                  type="button"
                  className="sub-btn sub-btn--secondary"
                  onClick={() => setIsNewSubModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sub-btn sub-btn--primary">
                  Activate Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 2: CREATE NEW PLAN
      ========================================================================= */}
      {isNewPlanModalOpen && (
        <div className="sub-modal-backdrop" onClick={() => setIsNewPlanModalOpen(false)}>
          <div className="sub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sub-modal__header">
              <div className="sub-modal__title-group">
                <h3 className="sub-modal__title">Create Membership Plan</h3>
                <p className="sub-modal__subtitle">Configure a new pricing package for subscribers</p>
              </div>
              <button
                type="button"
                className="sub-modal__close-btn"
                onClick={() => setIsNewPlanModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleCreatePlan}>
              <div className="sub-modal__body">
                <div className="sub-form-group">
                  <label className="sub-label">Plan Name</label>
                  <input
                    type="text"
                    className="sub-input"
                    placeholder="e.g. Gold Farmer Annual"
                    value={planForm.planName}
                    onChange={(e) => setPlanForm((p) => ({ ...p, planName: e.target.value }))}
                    required
                  />
                </div>

                <div className="sub-form-group">
                  <label className="sub-label">Description</label>
                  <textarea
                    className="sub-textarea"
                    placeholder="Summarize features and privileges included in this plan..."
                    value={planForm.description}
                    onChange={(e) => setPlanForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <div className="sub-form-row">
                  <div className="sub-form-group">
                    <label className="sub-label">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="sub-input"
                      placeholder="e.g. 49.99"
                      value={planForm.price}
                      onChange={(e) => setPlanForm((p) => ({ ...p, price: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="sub-form-group">
                    <label className="sub-label">Currency</label>
                    <select
                      className="sub-select"
                      value={planForm.currency}
                      onChange={(e) => setPlanForm((p) => ({ ...p, currency: e.target.value }))}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div className="sub-form-row">
                  <div className="sub-form-group">
                    <label className="sub-label">Duration</label>
                    <input
                      type="number"
                      min="1"
                      className="sub-input"
                      value={planForm.duration}
                      onChange={(e) => setPlanForm((p) => ({ ...p, duration: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="sub-form-group">
                    <label className="sub-label">Duration Unit</label>
                    <select
                      className="sub-select"
                      value={planForm.durationUnit}
                      onChange={(e) => setPlanForm((p) => ({ ...p, durationUnit: e.target.value }))}
                    >
                      <option value="DAY">Days</option>
                      <option value="MONTH">Months</option>
                      <option value="YEAR">Years</option>
                    </select>
                  </div>
                </div>

                <div className="sub-form-group">
                  <label className="sub-label">Region Code</label>
                  <input
                    type="text"
                    className="sub-input"
                    placeholder="e.g. GLOBAL, IN, US, MAHARASHTRA"
                    value={planForm.region}
                    onChange={(e) => setPlanForm((p) => ({ ...p, region: e.target.value.toUpperCase() }))}
                  />
                </div>
              </div>

              <div className="sub-modal__footer">
                <button
                  type="button"
                  className="sub-btn sub-btn--secondary"
                  onClick={() => setIsNewPlanModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sub-btn sub-btn--primary">
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 3: EDIT PLAN
      ========================================================================= */}
      {isEditPlanModalOpen && selectedPlan && (
        <div className="sub-modal-backdrop" onClick={() => setIsEditPlanModalOpen(false)}>
          <div className="sub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sub-modal__header">
              <div className="sub-modal__title-group">
                <h3 className="sub-modal__title">Edit Plan: {selectedPlan.planName}</h3>
                <p className="sub-modal__subtitle">Update tier pricing or duration details</p>
              </div>
              <button
                type="button"
                className="sub-modal__close-btn"
                onClick={() => setIsEditPlanModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleUpdatePlan}>
              <div className="sub-modal__body">
                <div className="sub-form-group">
                  <label className="sub-label">Plan Name</label>
                  <input
                    type="text"
                    className="sub-input"
                    value={planForm.planName}
                    onChange={(e) => setPlanForm((p) => ({ ...p, planName: e.target.value }))}
                    required
                  />
                </div>

                <div className="sub-form-group">
                  <label className="sub-label">Description</label>
                  <textarea
                    className="sub-textarea"
                    value={planForm.description}
                    onChange={(e) => setPlanForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <div className="sub-form-row">
                  <div className="sub-form-group">
                    <label className="sub-label">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="sub-input"
                      value={planForm.price}
                      onChange={(e) => setPlanForm((p) => ({ ...p, price: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="sub-form-group">
                    <label className="sub-label">Currency</label>
                    <select
                      className="sub-select"
                      value={planForm.currency}
                      onChange={(e) => setPlanForm((p) => ({ ...p, currency: e.target.value }))}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div className="sub-form-row">
                  <div className="sub-form-group">
                    <label className="sub-label">Duration</label>
                    <input
                      type="number"
                      min="1"
                      className="sub-input"
                      value={planForm.duration}
                      onChange={(e) => setPlanForm((p) => ({ ...p, duration: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="sub-form-group">
                    <label className="sub-label">Duration Unit</label>
                    <select
                      className="sub-select"
                      value={planForm.durationUnit}
                      onChange={(e) => setPlanForm((p) => ({ ...p, durationUnit: e.target.value }))}
                    >
                      <option value="DAY">Days</option>
                      <option value="MONTH">Months</option>
                      <option value="YEAR">Years</option>
                    </select>
                  </div>
                </div>

                <div className="sub-form-group">
                  <label className="sub-label">Region</label>
                  <input
                    type="text"
                    className="sub-input"
                    value={planForm.region}
                    onChange={(e) => setPlanForm((p) => ({ ...p, region: e.target.value }))}
                  />
                </div>
              </div>

              <div className="sub-modal__footer">
                <button
                  type="button"
                  className="sub-btn sub-btn--secondary"
                  onClick={() => setIsEditPlanModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sub-btn sub-btn--primary">
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 4: SUBSCRIPTION DETAILS
      ========================================================================= */}
      {selectedSubscription && (
        <div className="sub-modal-backdrop" onClick={() => setSelectedSubscription(null)}>
          <div className="sub-modal sub-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="sub-modal__header">
              <div className="sub-modal__title-group">
                <h3 className="sub-modal__title">Subscription Details</h3>
                <p className="sub-modal__subtitle">ID: {selectedSubscription.id}</p>
              </div>
              <button
                type="button"
                className="sub-modal__close-btn"
                onClick={() => setSelectedSubscription(null)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="sub-modal__body">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "10px",
                  border: "1px solid #e5e5e5",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    className={`sub-avatar ${
                      selectedSubscription.subscriberType === "CUSTOMER"
                        ? "sub-avatar--customer"
                        : "sub-avatar--vendor"
                    }`}
                    style={{ width: "46px", height: "46px", fontSize: "16px" }}
                  >
                    {(selectedSubscription.subscriberName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "700" }}>
                      {selectedSubscription.subscriberName}
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--sub-text-muted)" }}>
                      Code: <span className="sub-id-code">{selectedSubscription.subscriberId}</span> • Type:{" "}
                      <strong>{selectedSubscription.subscriberType}</strong>
                    </div>
                  </div>
                </div>

                <span
                  className={`sub-status-pill ${
                    selectedSubscription.status === "ACTIVE"
                      ? "sub-status-pill--active"
                      : selectedSubscription.status === "CANCELLED"
                      ? "sub-status-pill--cancelled"
                      : "sub-status-pill--expired"
                  }`}
                >
                  <span className="sub-status-pill__dot" />
                  <span>{selectedSubscription.status}</span>
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "14px",
                  fontSize: "13px",
                }}
              >
                <div style={{ padding: "12px", border: "1px solid #e5e5e5", borderRadius: "8px" }}>
                  <div style={{ color: "var(--sub-text-muted)", fontSize: "11.5px", marginBottom: "4px" }}>
                    PLAN PACKAGE
                  </div>
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>{selectedSubscription.planName}</div>
                  <div style={{ color: "var(--sub-text-muted)", fontSize: "11px" }}>
                    Plan ID: {selectedSubscription.planId}
                  </div>
                </div>

                <div style={{ padding: "12px", border: "1px solid #e5e5e5", borderRadius: "8px" }}>
                  <div style={{ color: "var(--sub-text-muted)", fontSize: "11.5px", marginBottom: "4px" }}>
                    BILLING AMOUNT
                  </div>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: "#111111" }}>
                    {formatCurrency(selectedSubscription.amount, selectedSubscription.currency)}
                  </div>
                  <div style={{ color: "var(--sub-text-muted)", fontSize: "11px" }}>
                    Currency: {selectedSubscription.currency || "USD"}
                  </div>
                </div>

                <div style={{ padding: "12px", border: "1px solid #e5e5e5", borderRadius: "8px" }}>
                  <div style={{ color: "var(--sub-text-muted)", fontSize: "11.5px", marginBottom: "4px" }}>
                    START DATE
                  </div>
                  <div style={{ fontWeight: "600" }}>{formatDate(selectedSubscription.startDate)}</div>
                </div>

                <div style={{ padding: "12px", border: "1px solid #e5e5e5", borderRadius: "8px" }}>
                  <div style={{ color: "var(--sub-text-muted)", fontSize: "11.5px", marginBottom: "4px" }}>
                    END / RENEWAL DATE
                  </div>
                  <div style={{ fontWeight: "600" }}>{formatDate(selectedSubscription.endDate)}</div>
                </div>
              </div>

              {selectedSubscription.cancelledAt && (
                <div
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    border: "1px solid #cccccc",
                    fontSize: "12.5px",
                    color: "#111111",
                  }}
                >
                  Subscription was cancelled on: {formatDate(selectedSubscription.cancelledAt)}
                </div>
              )}
            </div>

            <div className="sub-modal__footer">
              {selectedSubscription.status === "ACTIVE" ? (
                <button
                  type="button"
                  className="sub-btn sub-btn--danger-outline"
                  onClick={() => {
                    const subToCancel = selectedSubscription;
                    setSelectedSubscription(null);
                    handleCancelSubscription(subToCancel);
                  }}
                >
                  <CancelIcon />
                  <span>Cancel Subscription</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="sub-btn sub-btn--outline-primary"
                  onClick={() => {
                    handleActivateSubscription(selectedSubscription);
                    setSelectedSubscription(null);
                  }}
                >
                  <CheckIcon />
                  <span>Re-activate Subscription</span>
                </button>
              )}

              <button
                type="button"
                className="sub-btn sub-btn--secondary"
                onClick={() => setSelectedSubscription(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         CONFIRMATION DIALOG
      ========================================================================= */}
      {confirmDialog.isOpen && (
        <div
          className="sub-modal-backdrop"
          onClick={() => setConfirmDialog((p) => ({ ...p, isOpen: false }))}
        >
          <div className="sub-modal" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="sub-modal__header">
              <h3 className="sub-modal__title">{confirmDialog.title}</h3>
              <button
                type="button"
                className="sub-modal__close-btn"
                onClick={() => setConfirmDialog((p) => ({ ...p, isOpen: false }))}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="sub-modal__body">
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "var(--sub-text-secondary)" }}>
                {confirmDialog.message}
              </p>
            </div>

            <div className="sub-modal__footer">
              <button
                type="button"
                className="sub-btn sub-btn--secondary"
                onClick={() => setConfirmDialog((p) => ({ ...p, isOpen: false }))}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`sub-btn ${confirmDialog.isDanger ? "sub-btn--danger-outline" : "sub-btn--primary"}`}
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         FLOATING TOAST NOTIFICATIONS
      ========================================================================= */}
      <div className="sub-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`sub-toast sub-toast--${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

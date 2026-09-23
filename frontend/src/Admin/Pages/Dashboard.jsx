import React, { useEffect, useState } from "react";
import "../CSS/Dashboard.css";

function Dashboard() {
  
  // =================================================
  // DASHBOARD DATA
  // =================================================
  

  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    totalVendors: 0,
    pendingApprovals: 0,
    activeSubscriptions: 0,
    totalRevenue: 0
  });

  //*=================================
  // API STATES
  //*===================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //*=========================================
  // CALL ADMIN DASHBOARD API
  //*==========================================

  useEffect(() => {

    fetch("http://localhost:8080/api/admin/dashboard/summary")
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        return response.json();
      })

      .then((data) => {

        console.log("Dashboard API Response:", data);

        setDashboardData(data);
        setLoading(false);
      })

      .catch((error) => {

        console.error("Dashboard API Error:", error);

        setError("Unable to connect with backend");

        setLoading(false);
      });

  }, []);

  // LOADING
 

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  // ERROR
 

  if (error) {
    return (
      <div className="dashboard">
        <h2>{error}</h2>
        <p>
          Please make sure your Spring Boot backend is running.
        </p>
      </div>
    );
  }

  // =================================================
  // STATISTICS CARDS
  // =================================================

  const stats = [

    {
      title: "Total Customer",
      value: dashboardData.totalCustomers,
      icon: "♙"
    },

    {
      title: "Total Vendor",
      value: dashboardData.totalVendors,
      icon: "♟"
    },

    {
      title: "Pending Approvals",
      value: dashboardData.pendingApprovals,
      icon: "✓"
    },

    {
      title: "Active Subscriptions",
      value: dashboardData.activeSubscriptions,
      icon: "▣"
    },

    {
      title: "Total Revenue",
      value: `₹${dashboardData.totalRevenue}`,
      icon: "₹"
    },

    {
      title: "Total Booking",
      value: "0",
      icon: "▤"
    }

  ];

 //*=====================================
  // RETURN
 //*========================================

  return (

    <div className="dashboard">
       
       {/* PAGE HEADER */}
     

      <div className="Dashboard-header">
        <h2>Dashboard</h2>
      </div>

      {/* ==============================================
          STATISTICS CARDS
      ============================================== */}

      <div className="stats-grid">

        {stats.map((stat, index) => (

          <div className="stat-card" key={index}>

            <div className="stat-header">

              <span className="stat-title">
                {stat.title}
              </span>

              <span className="stat-icon">
                {stat.icon}
              </span>

            </div>

            <div className="stat-value">
              {stat.value}
            </div>

          </div>

        ))}

      </div>


      {/* ==============================================
          CHARTS
      ============================================== */}

      <div className="charts-grid">

        {/* REVENUE CHART */}

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h2>Revenue</h2>

              <p>
                Revenue overview
              </p>
            </div>

            <button className="period-button">
              Monthly
            </button>

          </div>


          <div className="revenue-chart">


            <div className="revenue-chart-area">

              <div className="revenue-grid grid-top"></div>
              <div className="revenue-grid grid-2"></div>
              <div className="revenue-grid grid-3"></div>
              <div className="revenue-grid grid-4"></div>
              <div className="revenue-grid grid-bottom"></div>



            </div>

          </div>

        </div>


        {/* CUSTOMER / VENDOR CHART */}

        <div className="chart-card">

          <div className="chart-header">

            <div>

              <h2>
                Customer & Vendor Overview
              </h2>

              <p>
                Monthly overview
              </p>

            </div>

            <button className="period-button">
              Monthly
            </button>

          </div>


          <div className="customer-vendor-chart">



            <div className="overview-chart-area">

              <div className="overview-grid top"></div>
              <div className="overview-grid second"></div>
              <div className="overview-grid third"></div>
              <div className="overview-grid fourth"></div>
              <div className="overview-grid bottom"></div>


              <div className="chart-legend">

                <div>
                  <span className="legend-customer"></span>
                  Customer
                </div>

                <div>
                  <span className="legend-vendor"></span>
                  Vendor
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
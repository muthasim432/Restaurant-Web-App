import React, { useState, useEffect } from 'react';
import SalesService from './SalesService';

const DashboardPage = () => {
  const [salesData, setSalesData] = useState({ daily: 0, weekly: 0, monthly: 0 });

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const data = await SalesService.getSalesData();
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Sales</h2>
      <p>Daily Sales: ${salesData.daily}</p>
      <p>Weekly Sales: ${salesData.weekly}</p>
      <p>Monthly Sales: ${salesData.monthly}</p>
    </div>
  );
};

export default DashboardPage;

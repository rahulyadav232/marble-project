import React, { useMemo, useState, useEffect } from "react";
import { CrudFilter, useList } from "@refinedev/core";
import dayjs from "dayjs";
import Stats from "../../components/dashboard/Stats";
import { ResponsiveAreaChart } from "../../components/dashboard/ResponsiveAreaChart";
import { ResponsiveBarChart } from "../../components/dashboard/ResponsiveBarChart";
import { TabView } from "../../components/dashboard/TabView";
import { RecentSales } from "../../components/dashboard/RecentSales";
import { IChartDatum, TTab } from "../../interfaces";





export const Dashboard: React.FC = () => {
    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'days').toDate());
  const [endDate, setEndDate] = useState(dayjs().toDate());
  const filters: CrudFilter[] = [
    {
      field: "start",
      operator: "eq",
      value: startDate,
      
    },
    {
      field: "end",
      operator: "eq",
      value: endDate,
    },
  ];

    const handleDateChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'start') {
      setStartDate(dayjs(value).toDate());
    } else if (name === 'end') {
      setEndDate(dayjs(value).toDate());
    }
  };

  const { data: dailyRevenue } = useList<IChartDatum>({
    resource: "dailyRevenue",
    filters,
  });

 


  const { data: dailyOrders } = useList<IChartDatum>({
    resource: "dailyOrders",
    filters,
  });

  const { data: newCustomers } = useList<IChartDatum>({
    resource: "newCustomers",
    filters,
  });

  const useMemoizedChartData = (d: any) => {
    return useMemo(() => {
      return d?.data?.data?.map((item: IChartDatum) => ({
        date: new Intl.DateTimeFormat("en-US", {
          month: "short",
          year: "numeric",
          day: "numeric",
        }).format(new Date(item.date)),
        value: item?.value,
      }));
    }, [d]);
  };

  const memoizedRevenueData = useMemoizedChartData(dailyRevenue);
  const memoizedOrdersData = useMemoizedChartData(dailyOrders);
  const memoizedNewCustomersData = useMemoizedChartData(newCustomers);

  

  const tabs: TTab[] = [
    {
      id: 1,
      label: "Daily Revenue",
      content: (
        <ResponsiveAreaChart
          kpi="Daily revenue"
          data={memoizedRevenueData}
          colors={{
            stroke: "rgb(54, 162, 235)",
            fill: "rgba(54, 162, 235, 0.2)",
          }}
        />
      ),
    },
    {
      id: 2,
      label: "Daily Orders",
      content: (
        <ResponsiveBarChart
          kpi="Daily orders"
          data={memoizedOrdersData}
          colors={{
            stroke: "rgb(255, 159, 64)",
            fill: "rgba(255, 159, 64, 0.7)",
          }}
        />
      ),
    },
    {
      id: 3,
      label: "New Customers",
      content: (
        <ResponsiveAreaChart
          kpi="New customers"
          data={memoizedNewCustomersData}
          colors={{
            stroke: "rgb(76, 175, 80)",
            fill: "rgba(54, 162, 235, 0.2)",
          }}
        />
      ),
    },
  ];

  return (
    <>
    <div style={{ marginBottom: '20px' }}>
        <label>Start Date:</label>
        <input
          type="date"
          name="start"
          value={dayjs(startDate).format('YYYY-MM-DD')}
          onChange={handleDateChange}
        />
        <label>End Date:</label>
        <input
          type="date"
          name="end"
          value={dayjs(endDate).format('YYYY-MM-DD')}
          // value={dayjs(endDate).format('YYYY-MM-DD')}
          onChange={handleDateChange}
        />
      </div>
      <Stats
        dailyRevenue={dailyRevenue}
        dailyOrders={dailyOrders}
        newCustomers={newCustomers}
      />
      <TabView tabs={tabs} />
      <RecentSales />
    </>
  );
};



import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layout/DashboardLayout';
import { OverviewPage } from './pages/OverviewPage';
import { OrdersPage } from './pages/OrdersPage';
import { HistoryPage } from './pages/HistoryPage';
import { InventoryPage } from './pages/InventoryPage';
import { MetricsPage } from './pages/MetricsPage';

/**
 * Main admin dashboard component with routing
 */
export function AdminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
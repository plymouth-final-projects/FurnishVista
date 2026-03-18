import { requestJson } from './api';

export type DashboardSummary = {
  totalDesigns: number;
  totalRooms: number;
  totalFurnitureItems: number;
  lastUpdatedAt: string;
};

export type RecentDesign = {
  id: string;
  name: string;
  updatedAt: string;
  thumbnail?: string | null;
};

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return requestJson<DashboardSummary>('/api/dashboard/summary', { method: 'GET' });
}

export async function fetchRecentDesigns(): Promise<RecentDesign[]> {
  return requestJson<RecentDesign[]>('/api/dashboard/recent-designs', { method: 'GET' });
}

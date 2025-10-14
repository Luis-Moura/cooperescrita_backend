import { DashboardResponse } from '../dto/DashboardResponse';

export const DASHBOARD_USECASE = 'DASHBOARD_USECASE';

export interface DashboardUseCase {
  getDashboardInfo(userId: string): Promise<DashboardResponse>;
}

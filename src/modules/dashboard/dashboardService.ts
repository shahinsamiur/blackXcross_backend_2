import * as dashboardRepository from "./dashboardRepository.js";

export const getDashboard = async () => {
  return await dashboardRepository.getDashboardData();
};
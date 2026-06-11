import api from "../api/axios";

export const getDashboardStats = async () => {
  const response =
    await api.get("/dashboard/stats");

  return response.data;
};

export const getIssuesByStatus =
  async () => {

    const response =
      await api.get(
        "/dashboard/issues-by-status"
      );

    return response.data;
};

export const getIssuesByPriority =
  async () => {

    const response =
      await api.get(
        "/dashboard/issues-by-priority"
      );

    return response.data;
};
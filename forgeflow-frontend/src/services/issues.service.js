import api from "../api/axios";

export const getIssues = async (params = {}) => {

  const response = await api.get("/issues", {
    params,
  });

  return response.data;

};
export const getProjectIssues = async (
  projectId
) => {

  const response =
    await api.get(
      `/projects/${projectId}/issues`
    );

  return response.data;

};

export const createIssue = async (issueData) => {
  const response = await api.post(
    "/issues",
    issueData
  );

  return response.data;
};
export const getIssueKPIs = async () => {

  const response =
    await api.get(
      "/issues/kpis"
    );

  return response.data;

};
export const getDashboardStats = async () => {

  const response = await api.get(
    "/issues/dashboard-stats"
  );

  return response.data.data;

};
export const getTaskDistribution =
async () => {

    const response =
        await api.get(
            "/issues/task-distribution"
        );

    return response.data.data;

};
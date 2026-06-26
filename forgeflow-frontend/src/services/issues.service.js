import api from "../api/axios";

export const getIssues = async () => {
  const response = await api.get("/issues");
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
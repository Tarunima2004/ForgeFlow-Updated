import api from "../api/axios";

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};
export const createProject = async (
  projectData
) => {
  const response = await api.post(
    "/projects",
    projectData
  );

  return response.data;
};
export const getProjectStats = async () => {
  const response =
    await api.get("/projects/stats");

  return response.data;
};
export const getProjectInsights =
  async () => {
    const response =
      await api.get(
        "/projects/insights"
      );

    return response.data;
  };
export async function getProjectHealth() {
const response = await fetch(
    "http://localhost:3000/projects/health"
  );

  const result = await response.json();

  return result.data;
}
export async function getUpcomingDeadlines() {

  const response =
    await fetch(
      "http://localhost:3000/projects/deadlines"
    );

  const result =
    await response.json();

  return result;
}
export async function getProjectTimeline() {

  const response =
    await fetch(
      "http://localhost:3000/projects/timeline"
    );

  const result =
    await response.json();

  return result;
}
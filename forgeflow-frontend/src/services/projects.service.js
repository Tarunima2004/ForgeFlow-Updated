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
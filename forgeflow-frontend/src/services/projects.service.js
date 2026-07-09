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

const response =
await api.get(
"/projects/health"
);

return response.data.data;

}
export async function getUpcomingDeadlines() {

const response =
await api.get(
"/projects/deadlines"
);

return response.data;

}
export async function getProjectTimeline() {

const response =
await api.get(
"/projects/timeline"
);

return response.data;
}
export const updateProject = async (
  projectId,
  projectData
) => {

  const response =
    await api.patch(

      `/projects/${projectId}`,

      projectData

    );

  return response.data;

};
export const archiveProject = async (
  projectId
) => {

  const response =
    await api.patch(
      `/projects/${projectId}/archive`
    );

  return response.data;

};
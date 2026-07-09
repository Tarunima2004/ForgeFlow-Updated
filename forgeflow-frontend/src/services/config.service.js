import api from "../api/axios";

export async function getDepartments() {
  const response = await api.get("/config/departments");
  return response.data.data;
}

export async function getJobRoles(department) {
  const response = await api.get(
    `/config/job-roles?department=${encodeURIComponent(department)}`
  );

  return response.data.data;
}
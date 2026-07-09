import api from "../api/axios";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
export const getJobRoles = async () => {
  const response =
    await api.get("/users/job-roles");

  return response.data;
};
export async function updateUserRole(
  userId,
  role
) {

  const response =
    await api.patch(

      `/users/${userId}/role`,

      {
        role,
      }

    );

  return response.data;

}
export async function getUserById(id) {

  const response =
    await api.get(`/users/${id}`);

  return response.data;

}
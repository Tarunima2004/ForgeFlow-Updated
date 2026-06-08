import api from "../api/axios";

export const getRecentActivity =
  async () => {

    const response =
      await api.get(
        "/activity"
      );

    return response.data;
  };
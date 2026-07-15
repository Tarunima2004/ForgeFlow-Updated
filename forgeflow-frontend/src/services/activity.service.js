import api from "../api/axios";

export const getRecentActivity =
  async () => {

    const response =
      await api.get(
        "/activity"
      );

    return response.data;
  };
  export const getMyActivity = async () => {

    const response = await api.get(
        "/activity/my"
    );

    return response.data.data;

};
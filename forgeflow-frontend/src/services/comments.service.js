import api from "../api/axios";

/**
 * Get all comments for an issue
 */
export const getIssueComments = async (issueId) => {

    const response = await api.get(
        `/issues/${issueId}/comments`
    );

    return response.data.data;

};
export async function createComment(issueId, data) {
    const response = await api.post(
        `/issues/${issueId}/comments`,
        data
    );

    return response.data.data;
}
export const updateComment = async (
    commentId,
    data
) => {

    const response = await api.patch(
        `/comments/${commentId}`,
        data
    );

    return response.data.data;

};
export const deleteComment = async (
    commentId
) => {

    const response = await api.delete(
        `/comments/${commentId}`
    );

    return response.data;

};
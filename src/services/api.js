import axios from 'axios';
import env from "react-dotenv";

const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  fetchFolders() {
    return apiClient.get('/folders');
  },

  createFolder(data) {
    return apiClient.post('/folders', data);
  },

  fetchTodos(folderId) {
    return apiClient.get(`/folders/${folderId}/todos`);
  },

  searchTodos(search) {
    return apiClient.get(`/todos/search?search=${search}`);
  },

  updateTodoStatus(todoId, data) {
    return apiClient.patch(`/todos/${todoId}`, data);
  },
  
  deleteTodo(todoId) {
    return apiClient.delete(`/todos/${todoId}`);
  }
};
import axiosInstance from './axiosInstance';

export const userService = {
  register: (userData) => axiosInstance.post('/register', userData),
  registerGoogle: (userData) => axiosInstance.post('/registerGoogle', userData),
  login: (credentials) => axiosInstance.post('/login', credentials),
  loginGoogle: (credentials) => axiosInstance.post('/loginGoogle', credentials),
  isLoggedIn: () => axiosInstance.get('/isLoggedIn'),
  getUser: () => axiosInstance.get('/getUser'),
  getUsers: () => axiosInstance.get('/getUsers'),
  blockUsers: (data) => axiosInstance.post('/admin/block', data),
  unblockUsers: (data) => axiosInstance.post('/admin/unblock', data),
  promoteUsers: (data) => axiosInstance.post('/admin/promote', data),
  demoteUsers: (data) => axiosInstance.post('/admin/demote', data),
  deleteUsers: (data) => axiosInstance.delete('/admin/delete', {data}),
  deleteUnverifiedUsers: () => axiosInstance.delete('/admin/unverified')
};

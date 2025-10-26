import axiosInstance from './axiosInstance';

export const userService = {
  register: (userData) => axiosInstance.post('/register', userData),
  registerGoogle: async (userData) => axiosInstance.post('/registerGoogle', userData),
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
  deleteUnverifiedUsers: () => axiosInstance.delete('/admin/unverified'),
  createInventory: (data) => axiosInstance.post('/createInventory', data),
  getInventory: (inventoryId) => axiosInstance.get(`/getInventory/${inventoryId}`),
  saveInventory: (inventory) => axiosInstance.post(`/saveInventory`, inventory),
  saveCustomID: (customID) => axiosInstance.post('/saveCustomID', { customID }),
  saveChat: (data) => axiosInstance.post(`/saveChat`, data),

  getUsersInventories: (userId) => axiosInstance.get(`/getUsersInventories/${userId}`),

  getEditableInventories: (userId) => axiosInstance.get(`/getEditableInventories/${userId}`),

  deleteInventory: (inventoryId) => axiosInstance.post('/deleteInventory', { inventoryId }),
  addEditor: (editors, inventoryId) => 
    axiosInstance.post('/addEditor', { editors, inventoryId }),
  deleteEditor: (inventoryId) => axiosInstance.post('/deleteEditor', { inventoryId }),
  addItem: (data) => axiosInstance.post('/addItem', data),
  searchUsersByEmail: (email) => axiosInstance.post('/search', { email }),
  deleteitem: (item_id, inv_id, creator_id) => axiosInstance.post('/deleteItem', { item_id, inv_id, creator_id }),
  saveTags: (data) => axiosInstance.post('/saveTags', data),
  getLastInventories: () => axiosInstance.get('/inventories/last'),
  getPopularInventories: () => axiosInstance.get('/inventories/popular'),
  getRandomTags: () => axiosInstance.get('/random'),
  getCurrentUser: () => axiosInstance.get('/session-user'),
  getInventoriesByTag: (tagId) => 
    axiosInstance.get('/inventoriesByTag', {
      params: { tagId }  
  }),
  logout: () => axiosInstance.post('/logout')
};

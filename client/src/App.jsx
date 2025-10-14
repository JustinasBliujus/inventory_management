import { useEffect } from 'react'
import axios from 'axios';
import RegisterPage from './pages/register_page/register';
import LoginPage from './pages/login_page/login';
import AdminPage from './pages/admin_page/admin';
import MainPage from './pages/main_page/main';
import SearchPage from './pages/search_page/search';
import PersonalPage from './pages/personal_page/personal';
import InventoryPage from './pages/inventory_page/inventory';
import ItemsPage from './pages/items_page/items';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  
  const fetchAPI = async () => {
    const response = await axios.get('http://localhost:3000/api');
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/personal" element={<PersonalPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/items" element={<ItemsPage />} />
      </Routes>
    </Router>
  );
}

export default App

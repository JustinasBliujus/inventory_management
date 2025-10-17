import RegisterPage from './pages/register_page/register';
import LoginPage from './pages/login_page/login';
import AdminPage from './pages/admin_page/admin';
import MainPage from './pages/main_page/main';
import SearchPage from './pages/search_page/search';
import PersonalPage from './pages/personal_page/personal';
import InventoryPage from './pages/inventory_page/inventory';
import ItemsPage from './pages/items_page/items';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './privateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="is_admin">
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/personal"
          element={
            <PrivateRoute>
              <PersonalPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/items"
          element={
            <PrivateRoute>
              <ItemsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

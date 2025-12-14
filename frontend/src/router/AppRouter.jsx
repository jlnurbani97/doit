import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Registration from '../pages/Register';
import Header from '../components/Header';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

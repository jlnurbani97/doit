import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Registration from '../pages/Register';
import Header from '../components/Header';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

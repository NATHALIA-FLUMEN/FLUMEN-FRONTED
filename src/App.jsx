import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import FreeVideos from './pages/FreeVideos.jsx';
import PremiumVideos from './pages/PremiumVideos.jsx';
import VideoPage from './pages/VideoPage.jsx';
import NotFound from './pages/NotFound.jsx';
import Auth from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import RequireAuth from './components/auth/RequireAuth.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminVideos from './pages/admin/AdminVideos.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/gratis" element={<FreeVideos />} />
          <Route path="/premium" element={<PremiumVideos />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pago/exito" element={<PaymentSuccess />} />

          {/* Protegidas */}
          <Route path="/perfil" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route
            path="/checkout/:id"
            element={<RequireAuth><Checkout /></RequireAuth>}
          />

          {/* Panel admin */}
          <Route
            path="/admin"
            element={<RequireAuth adminOnly><AdminLayout /></RequireAuth>}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

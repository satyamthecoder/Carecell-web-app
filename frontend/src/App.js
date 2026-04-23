
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './context/authStore';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Request + Admi
import RequestHelp from './pages/RequestHelp';
import AdminDonations from './pages/AdminDonations';

// ✅ Public Health Card
import PublicHealthCard from "./pages/PublicHealthCard";

// ✅ TERMS PAGE (FIXED)
import Terms from "./pages/Terms";

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const HealthCard = lazy(() => import('./pages/HealthCard'));
const EmergencyMode = lazy(() => import('./pages/EmergencyMode'));
const DonorProfile = lazy(() => import('./pages/DonorProfile'));
const BloodRequest = lazy(() => import('./pages/BloodRequest'));
const HospitalFinder = lazy(() => import('./pages/HospitalFinder'));
const MedicalExplainer = lazy(() => import('./pages/MedicalExplainer'));
const TreatmentTracker = lazy(() => import('./pages/TreatmentTracker'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const Schemes = lazy(() => import('./pages/Schemes'));
const DailyCheckin = lazy(() => import('./pages/DailyCheckin'));
const Profile = lazy(() => import('./pages/Profile'));

// 🔐 Private Route
const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

// 🔓 Public Route
const PublicRoute = ({ children }) => {
  const { token } = useAuthStore();
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" />

      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>

          {/* 🔓 PUBLIC ROUTES */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* ✅ TERMS (PUBLIC — NO LOGIN) */}
          <Route path="/terms" element={<Terms />} />

          {/* ✅ PUBLIC QR */}
          <Route path="/public-healthcard/:userId" element={<PublicHealthCard />} />

          {/* 🔐 PROTECTED ROUTES */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>

            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="health-card" element={<HealthCard />} />
            <Route path="emergency" element={<EmergencyMode />} />
            <Route path="donor" element={<DonorProfile />} />
            <Route path="blood-request" element={<BloodRequest />} />
            <Route path="hospitals" element={<HospitalFinder />} />
            <Route path="explain" element={<MedicalExplainer />} />
            <Route path="treatments" element={<TreatmentTracker />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="schemes" element={<Schemes />} />
            <Route path="checkin" element={<DailyCheckin />} />
            <Route path="profile" element={<Profile />} />

            <Route path="request-help" element={<RequestHelp />} />
            <Route path="admin-donations" element={<AdminDonations />} />

          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './context/authStore';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
/*this code for request */import RequestHelp from './pages/RequestHelp';
import AdminDonations from './pages/AdminDonations';
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

const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { token } = useAuthStore();
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: { fontFamily: 'Noto Sans, sans-serif', fontSize: '14px', maxWidth: '380px' },
          success: { iconTheme: { primary: '#0d9488', secondary: 'white' } },
          error: { iconTheme: { primary: '#c80d0d', secondary: 'white' } },
        }}
      />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected */}
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
           /*this line for rquest form*/ <Route path="/request-help" element={<RequestHelp />} />
           <Route path="/admin-donations" element={<AdminDonations />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

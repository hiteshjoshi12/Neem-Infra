import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CmsProvider } from './context/CmsContext';

// Common & Layout Components
import PageLoader from './components/ui/PageLoader';
import ScrollToTop from './components/common/ScrollToTop';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public Pages (Lazy loaded)
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages (Lazy loaded)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminSectionsCMS = lazy(() => import('./pages/admin/AdminSectionsCMS'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CmsProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/ready-to-move" element={<Home />} />
                <Route path="/new-launches" element={<Home />} />
                <Route path="/under-construction" element={<Home />} />
                <Route path="/about" element={<Home />} />
                <Route path="/developers" element={<Home />} />
              </Route>

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin CMS Portal */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="sections" element={<AdminSectionsCMS />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="inquiries" element={<AdminInquiries />} />
                </Route>
              </Route>

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CmsProvider>
      </AuthProvider>
    </Router>
  );
}
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components (Eagerly loaded for immediate shell render)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageLoader from './components/ui/PageLoader';

// Pages (Lazy loaded for optimal bundle splitting)
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
        <Navbar />

        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ready-to-move" element={<Home />} />
              <Route path="/new-launches" element={<Home />} />
              <Route path="/under-construction" element={<Home />} />
              <Route path="/about" element={<Home />} />
               <Route path="/developers" element={<Home />} />
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ServicesProvider } from './context/ServicesContext';

import Home from './pages/Home';
import HomeService from './pages/HomeService';
import PackersAndMovers from './pages/PackersAndMovers';
import InteriorDesign from './pages/InteriorDesign';
import InteriorEnquiry from './pages/InteriorEnquiry';
import SearchResults from './pages/SearchResults';
import RentalAgreement from './pages/RentalAgreement';
import AgreementForm from './pages/AgreementForm';
import ElectricianServices from './pages/ElectricianServices';
import ScheduleService from './pages/ScheduleService';
import CleaningServices from './pages/CleaningServices';
import PaintingServices from './pages/PaintingServices';
import PlumbingServices from './pages/PlumbingServices';
import InteriorGallery from './pages/InteriorGallery';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Chatbot from './components/Chatbot';
import Login from './pages/Login';

function App() {
  return (
    <ServicesProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/home-service" element={<HomeService />} />
            <Route path="/packers-and-movers" element={<PackersAndMovers />} />
            <Route path="/interior-design" element={<InteriorDesign />} />
            <Route path="/interior-enquiry" element={<InteriorEnquiry />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/rental-agreement" element={<RentalAgreement />} />
            <Route path="/create-agreement" element={<AgreementForm />} />
            <Route path="/electrician-services" element={<ElectricianServices />} />
            <Route path="/cleaning-services" element={<CleaningServices />} />
            <Route path="/painting-services" element={<PaintingServices />} />
            <Route path="/plumbing-services" element={<PlumbingServices />} />
            <Route path="/interior-gallery" element={<InteriorGallery />} />
            <Route path="/schedule-service" element={<ScheduleService />} />

            {/* Admin Portal */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          {/* Floating Components persists across all routes */}
          <Chatbot />
        </div>
      </Router>
    </ServicesProvider>
  );
}

export default App;

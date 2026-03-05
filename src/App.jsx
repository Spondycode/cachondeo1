import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Members from './pages/Members';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Admin from './pages/Admin';
import EditSong from './pages/EditSong';
import SongDetail from './pages/SongDetail';
import RehearsalDetail from './pages/RehearsalDetail';
import EditRehearsal from './pages/EditRehearsal';
import Profile from './pages/Profile';
import PublicRepertoire from './pages/PublicRepertoire';
import Attendance from './pages/Attendance';
import AttendanceEdit from './pages/AttendanceEdit';

import SignUp from './pages/SignUp';
import Contact from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/repertoire" element={<PublicRepertoire />} />
              <Route path="/contact" element={<Contact />} />
              {/* Hidden Sign Up Page */}
              <Route path="/918273645042" element={<SignUp />} />
              <Route
                path="/members"
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/song/:id"
                element={
                  <ProtectedRoute>
                    <SongDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rehearsal"
                element={
                  <ProtectedRoute>
                    <RehearsalDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/edit-song/:id"
                element={
                  <AdminRoute>
                    <EditSong />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/edit-rehearsal"
                element={
                  <AdminRoute>
                    <EditRehearsal />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/attendance"
                element={
                  <AdminRoute>
                    <Attendance />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/attendance/:date"
                element={
                  <AdminRoute>
                    <AttendanceEdit />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

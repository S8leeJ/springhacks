import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <div className='bg-pink-100'>
        <Router>
          <AppContent />
        </Router>
      </div>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/signup', '/signin'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
export default App;
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const { logout } = useAuth();
    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        navigate('/');
    };

    return (
        <div className="flex items-center justify-between p-4 bg-pink-300 text-white">
            <div className="flex gap-4">
                <Link to="/home" className="text-pink-700 text-lg text-bold hover:text-pink-900">Home</Link>
                <Link to="/dashboard" className="text-pink-700 text-lg text-bold hover:text-pink-900">Dashboard</Link>
            </div>
            {isLoggedIn && (
                <button
                    onClick={handleLogout}
                    className="bg-white text-pink-500 px-4 py-2 rounded hover:bg-pink-100 font-semibold"
                >
                    Logout
                </button>
            )}
        </div>
    );
}
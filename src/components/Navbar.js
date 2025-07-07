import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const { logout, user } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        navigate('/');
    };

    return (
        <div className="flex items-center justify-between p-4 bg-pink-300 text-white">
            <div className="flex gap-4">
            <h1 className="text-white-700 text-lg text-bold">Tidbit</h1>

                <Link to="/home" className="text-pink-700 text-lg text-bold hover:text-pink-900">Home</Link>
                <Link to="/dashboard" className="text-pink-700 text-lg text-bold hover:text-pink-900">Dashboard</Link>
            </div>

            {isLoggedIn && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-white text-lg text-bold">Welcome, {user.name}</span>

                    </div>
                     <Link to="/settings" className="hover:text-pink-900" title="Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0a1.724 1.724 0 002.573.982c.797-.46 1.757.388 1.518 1.247a1.724 1.724 0 002.062 2.062c.86-.239 1.707.721 1.247 1.518a1.724 1.724 0 00.982 2.573c.921.3.921 1.603 0 1.902a1.724 1.724 0 00-.982 2.573c.46.797-.388 1.757-1.247 1.518a1.724 1.724 0 00-2.062 2.062c.239.86-.721 1.707-1.518 1.247a1.724 1.724 0 00-2.573.982c-.3.921-1.603.921-1.902 0a1.724 1.724 0 00-2.573-.982c-.797.46-1.757-.388-1.518-1.247a1.724 1.724 0 00-2.062-2.062c-.86.239-1.707-.721-1.247-1.518a1.724 1.724 0 00-.982-2.573c-.921-.3-.921-1.603 0-1.902a1.724 1.724 0 00.982-2.573c-.46-.797.388-1.757 1.247-1.518a1.724 1.724 0 002.062-2.062c-.239-.86.721-1.707 1.518-1.247.797.46 1.757-.388 2.573-.982z" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none"/>
                        </svg>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-white text-pink-500 px-4 py-2 rounded hover:bg-pink-100 font-semibold"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
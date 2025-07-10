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
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mr-2"
                viewBox="0 0 32 32"
                fill="none"
            >
                <circle cx="16" cy="16" r="15" fill="#ec4899" stroke="#db2777" strokeWidth="2"/>
                <rect x="10" y="8" width="12" height="16" rx="3" fill="white" />
                <rect x="13" y="11" width="6" height="2" rx="1" fill="#f472b6" />
                <rect x="13" y="15" width="6" height="2" rx="1" fill="#f472b6" />
                <rect x="13" y="19" width="4" height="2" rx="1" fill="#f472b6" />
                <circle cx="22" cy="10" r="3" fill="#f472b6" stroke="#db2777" strokeWidth="1"/>
                <path d="M22 8.5v3" stroke="#db2777" strokeWidth="1" strokeLinecap="round"/>
                <path d="M20.5 10h3" stroke="#db2777" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <h1 className="text-pink-700 text-2xl font-extrabold tracking-tight drop-shadow-lg flex items-center">
                Tidbit
            </h1>   
                <Link to="/home" className="text-pink-600 text-2xl tracking-tight drop-shadow-lg flex items-center hover:text-pink-200">Play War</Link>
                <Link to="/dashboard" className="text-pink-600 text-2xl tracking-tight drop-shadow-lg flex items-center hover:text-pink-200">Dashboard</Link>
            </div>

            {isLoggedIn && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        {user && (
                            <span className="text-white text-2xl tracking-tight drop-shadow-lg flex items-center">Welcome, {user.name}</span>
                        )}
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
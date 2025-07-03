import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <div className="flex items-center p-4 bg-blue-500 text-white gap-4">
            <Link to="/" className="text-white hover:text-gray-200">Home</Link>
            <Link to="/dashboard" className="text-white hover:text-gray-200">Dashboard</Link>
        </div>
    )
}
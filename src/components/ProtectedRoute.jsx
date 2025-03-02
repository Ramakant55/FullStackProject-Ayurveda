import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem('token');
    const userProfile = localStorage.getItem('userProfile');

    if (!token || !userProfile) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute; 
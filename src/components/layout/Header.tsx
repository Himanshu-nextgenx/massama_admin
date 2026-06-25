import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-left">
                {/* Date and Branch removed as per requirements */}
            </div>
            <div className="header-right">
                <div className="user-profile">
                    <div className="user-info">
                        <h4>Admin</h4>
                        <span>ADMIN</span>
                    </div>
                    <div className="user-avatar">A</div>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={handleLogoutClick}
                    style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>

            {showLogoutConfirm && (
                <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-header">
                            <h3>Confirm Logout</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to logout from the admin panel?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowLogoutConfirm(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={confirmLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

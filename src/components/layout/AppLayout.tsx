import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`app-layout ${isCollapsed ? 'collapsed' : ''}`}>
            <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            <main className="main-content">
                <Header />
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

import {
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Gift,
    Image,
    LayoutDashboard,
    Package,
    ShoppingBag,
    Sparkles,
    Store,
    Users
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'User Details' },
    { path: '/members', icon: Building2, label: 'Member Directory' },
    { path: '/products', icon: Package, label: 'Available stock with members' },
    { path: '/member-products', icon: ShoppingBag, label: 'Member Products' },
    { path: '/events', icon: Calendar, label: 'MASSMA events' },
    { path: '/banners', icon: Image, label: 'Advertisements' },
    { path: '/exhibitions', icon: Store, label: 'Worldwide expos' },
    { path: '/offers', icon: Gift, label: 'Massma Updates' },
    { path: '/non-payer-customers', icon: Users, label: 'Non Payer Customers' },
    { path: '/presidents', icon: Users, label: 'Past presidents' },
    { path: '/committee-members', icon: Users, label: 'Committee' },
    { path: '/technical-details', icon: Package, label: 'Technical data' },
    { path: '/hughes', icon: Package, label: 'Product-Wise Members Data' },
    { path: '/essential-contacts', icon: Users, label: 'Essential Contacts' },
    // { path: '/news', icon: Newspaper, label: 'News' },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-logo">
                <h1>
                    <Sparkles size={24} />
                    {!isCollapsed && <span>Massma</span>}
                </h1>
                <button className="collapse-toggle" onClick={onToggle}>
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon size={20} />
                        {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

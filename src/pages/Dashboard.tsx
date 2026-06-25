import { Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBannerStore } from '../store/bannerStore';
import api from '../utils/auth';

export default function Dashboard() {
    const { banners, fetchBanners, isLoading } = useBannerStore();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, companies: 0, products: 0, members: 0 });

    useEffect(() => {
        fetchBanners();
        // Fetch stats
        api.get('/stats').then(res => setStats(res.data)).catch(console.error);
    }, [fetchBanners]);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gap: 24 }}>
                {/* Stats Section */}
                <div style={{
                    display: 'flex',
                    gap: 12,
                    marginBottom: 10,
                }}>
                    <div className="stats-card" style={{ flex: 1, padding: 20, background: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: 13, color: '#6F767E', marginBottom: 4 }}>Total Companies</div>
                        <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.companies}</div>
                    </div>
                    <div className="stats-card" style={{ flex: 1, padding: 20, background: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: 13, color: '#6F767E', marginBottom: 4 }}>Total Users</div>
                        <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.users}</div>
                    </div>
                    <div className="stats-card" style={{ flex: 1, padding: 20, background: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: 13, color: '#6F767E', marginBottom: 4 }}>Total Members</div>
                        <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.members}</div>
                    </div>
                    <div className="stats-card" style={{ flex: 1, padding: 20, background: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: 13, color: '#6F767E', marginBottom: 4 }}>Total Products</div>
                        <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.products}</div>
                    </div>
                </div>

                {/* Banners Section */}
                <div className="card">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Active App Banners</h3>
                        <button
                            className="btn btn-secondary"
                            style={{ fontSize: 12, padding: '4px 12px' }}
                            onClick={() => navigate('/banners')}
                        >
                            Manage
                        </button>
                    </div>

                    <div style={{ padding: 20 }}>
                        {isLoading ? (
                            <p style={{ textAlign: 'center', color: '#6F767E' }}>Loading banners...</p>
                        ) : banners.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px 0', color: '#6F767E' }}>
                                <ImageIcon size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                                <p>No banners active</p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: 16
                            }}>
                                {banners.map((banner: any) => (
                                    <div key={banner.id} style={{
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        border: '1px solid #E5E7EB',
                                        aspectRatio: '2/1'
                                    }}>
                                        <img
                                            src={banner.image}
                                            alt="Banner"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

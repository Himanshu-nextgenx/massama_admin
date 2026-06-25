import { ArrowLeft, Building2, Calendar, Mail, Phone, Shield, CreditCard } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedUser: user, isLoading, error, fetchUserById, clearError } = useUserStore();

    useEffect(() => {
        if (id) {
            fetchUserById(parseInt(id, 10));
        }
        return () => clearError();
    }, [id, fetchUserById, clearError]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate('/users')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">User Not Found</h1>
                </div>
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error || 'The requested user could not be found.'}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={() => navigate('/users')}
                    style={{
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <ArrowLeft size={24} color="#374151" />
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>User Details</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
                {/* Left Column - Profile Card */}
                <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {user.profile_image ? (
                        <img
                            src={user.profile_image}
                            alt={user.fullname || 'User'}
                            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '4px solid #F3F4F6' }}
                        />
                    ) : (
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: '#E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px',
                            fontWeight: 600,
                            color: '#6B7280',
                            marginBottom: '16px',
                            border: '4px solid #F3F4F6'
                        }}>
                            {(user.fullname || 'U')[0].toUpperCase()}
                        </div>
                    )}
                    
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>{user.fullname || '-'}</h2>
                    <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '14px',
                        fontWeight: 500,
                        backgroundColor: user.role === 'admin' ? '#FEE2E2' : '#E0E7FF',
                        color: user.role === 'admin' ? '#991B1B' : '#3730A3',
                        textTransform: 'capitalize'
                    }}>
                        {user.role || 'user'}
                    </span>

                    <div style={{ marginTop: '24px', width: '100%', borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#4B5563' }}>
                            <Shield size={20} color="#9CA3AF" />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '12px', color: '#6B7280' }}>Member Directory App Access</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                    <label style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        width: 44,
                                        height: 24,
                                        cursor: 'pointer',
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={!!user.member_directory_access}
                                            onChange={async (e) => {
                                                const useUserStoreRaw = await import('../store/userStore').then(m => m.useUserStore);
                                                useUserStoreRaw.getState().toggleMemberAccess(user.id, e.target.checked);
                                            }}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: user.member_directory_access ? '#22C55E' : '#D1D5DB',
                                            borderRadius: 24,
                                            transition: 'background-color 0.3s',
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                height: 18,
                                                width: 18,
                                                left: user.member_directory_access ? 22 : 3,
                                                bottom: 3,
                                                backgroundColor: 'white',
                                                borderRadius: '50%',
                                                transition: 'left 0.3s',
                                            }} />
                                        </span>
                                    </label>
                                    <span style={{ fontWeight: 500, fontSize: '13px', color: user.member_directory_access ? '#059669' : '#6B7280' }}>
                                        {user.member_directory_access ? 'Active' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details & Companies */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Contact Information */}
                    <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>Contact Information</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <Phone size={20} color="#6B7280" style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Mobile Number</div>
                                    <div style={{ fontWeight: 500, color: '#111827' }}>{user.mobile_number || '-'}</div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <Mail size={20} color="#6B7280" style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Email Address</div>
                                    <div style={{ fontWeight: 500, color: '#111827' }}>{user.email || '-'}</div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <CreditCard size={20} color="#6B7280" style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>PAN Card</div>
                                    <div style={{ fontWeight: 500, color: '#111827' }}>{user.pancard_number || '-'}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <Calendar size={20} color="#6B7280" style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Joined Date</div>
                                    <div style={{ fontWeight: 500, color: '#111827' }}>
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Associated Companies (Member Directory Profiles) */}
                    <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Building2 size={20} color="#4F46E5" />
                            Associated Member Profiles
                            <span style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', marginLeft: 'auto' }}>
                                {user.companies?.length || 0}
                            </span>
                        </h3>
                        
                        {(!user.companies || user.companies.length === 0) ? (
                            <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B7280', background: '#F9FAFB', borderRadius: '8px', border: '1px dashed #D1D5DB' }}>
                                <Building2 size={32} color="#D1D5DB" style={{ margin: '0 auto 12px auto' }} />
                                <p style={{ margin: 0, fontSize: '14px' }}>No member directory profiles associated with this user.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {user.companies.map((company: any) => (
                                    <div key={company.id} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            {company.logo ? (
                                                <img src={company.logo} alt={company.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'contain', background: '#FFF' }} />
                                            ) : (
                                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: '18px', fontWeight: 600 }}>
                                                    {company.name ? company.name[0].toUpperCase() : 'C'}
                                                </div>
                                            )}
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#111827' }}>{company.name}</h4>
                                                <div style={{ fontSize: '13px', color: '#6B7280', display: 'flex', gap: '16px' }}>
                                                    {company.gst_no && <span>GST: <span style={{ color: '#374151' }}>{company.gst_no}</span></span>}
                                                    {company.city && <span>City: <span style={{ color: '#374151' }}>{company.city}</span></span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/members/${company.id}`)}
                                            style={{ padding: '6px 16px', background: '#FFF', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#FFF'}
                                        >
                                            View Member
                                        </button>
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

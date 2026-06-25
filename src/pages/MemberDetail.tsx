import { ArrowLeft, Building2, CreditCard, FileText, Globe, Hash, Image as ImageIcon, Landmark, Mail, MapPin, Package, Phone, User } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemberProductStore } from '../store/memberProductStore';
import { useMemberStore } from '../store/memberStore';

export default function MemberDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { selectedMember, isLoading, fetchMemberById } = useMemberStore();
    const { memberProducts, fetchMemberProducts, isLoading: isProductsLoading } = useMemberProductStore();

    useEffect(() => {
        if (id) {
            fetchMemberById(Number(id));
            fetchMemberProducts({
                page: 1, limit: 100, member_id: Number(id)
            });
        }
    }, [id, fetchMemberById, fetchMemberProducts]);

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!selectedMember) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <p>Member not found</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/members')}>
                    Back to List
                </button>
            </div>
        );
    }

    const member = selectedMember;
    const formatMno = (id: number) => `#A-${String(id).padStart(3, '0')}`;
    const hasUser = !!member.user;

    const DetailItem = ({ icon, label, value, href }: { icon: React.ReactNode, label: string, value: string | number | null | undefined, href?: string }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6F767E', fontSize: 13, fontWeight: 500 }}>
                {icon}
                <span>{label}</span>
            </div>
            {href && value ? (
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, fontWeight: 500, color: '#2F80ED', textDecoration: 'none' }}>
                    {value}
                </a>
            ) : (
                <div style={{ fontSize: 15, fontWeight: 500, color: '#1A1D1F', paddingLeft: 24 }}>
                    {value || '-'}
                </div>
            )}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <div className="page-header sticky-header" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', background: 'white', zIndex: 10, padding: '20px 32px', borderBottom: '1px solid #EFEFEF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        onClick={() => navigate('/members')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: '#6F767E' }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="page-title" style={{ margin: 0 }}>Member Details</h1>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/members/${id}/edit`)}
                    >
                        Edit Details
                    </button>
                </div>
            </div>

            <div className="detail-layout" style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px', width: '100%', gap: 32 }}>
                {/* Profile Card */}
                <div className="profile-card card" style={{ padding: 24, height: 'fit-content', border: '1px solid #EFEFEF', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div className="profile-avatar" style={{ width: 120, height: 120, margin: '0 auto 20px' }}>
                        {member.logo ? (
                            <img
                                src={member.logo}
                                alt={member.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#F4F4F4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 600, color: '#9A9FA5' }}>
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h2 className="profile-name" style={{ textAlign: 'center', fontSize: 24, marginBottom: 4 }}>{member.name}</h2>
                    <p style={{ textAlign: 'center', color: '#6F767E', margin: '0 0 24px' }}>{formatMno(member.id)}</p>

                    <div className="profile-info" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <DetailItem icon={<User size={16} />} label="Username" value={member.name} />
                        <DetailItem icon={<Mail size={16} />} label="Billing Email" value={member.email} />
                        <DetailItem icon={<MapPin size={16} />} label="Address" value={`${member.address || ''} ${member.city ? `, ${member.city}` : ''}`} />
                        <DetailItem icon={<Phone size={16} />} label="Contact" value={member.mobile_number} />

                        <div style={{ borderTop: '1px solid #EFEFEF', paddingTop: 20, marginTop: 10 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#9A9FA5', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bank Details</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <DetailItem icon={<Landmark size={16} />} label="Bank" value={member.bank} />
                                <DetailItem icon={<Building2 size={16} />} label="Branch" value={member.branch} />
                                <DetailItem icon={<CreditCard size={16} />} label="Account Number" value={member.account_number} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>

                    {/* User Details Section */}
                    {hasUser && member.user && (
                        <div className="card" style={{ border: '1px solid #EFEFEF', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                            <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid #F4F4F4', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <User size={20} color="#2F80ED" />
                                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>User Details</h3>
                            </div>
                            <div className="card-body detail-grid" style={{ padding: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                <DetailItem icon={<User size={16} />} label="Full Name" value={member.user.fullname} />
                                <DetailItem icon={<Mail size={16} />} label="Email" value={member.user.email} />
                                <DetailItem icon={<Phone size={16} />} label="Mobile Number" value={member.user.mobile_number} />
                            </div>
                        </div>
                    )}

                    {/* Company Details Card */}
                    <div className="card" style={{ border: '1px solid #EFEFEF', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                        <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid #F4F4F4', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Building2 size={20} color="#2F80ED" />
                            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Company Details</h3>
                            {member.amd && (
                                <span style={{ marginLeft: 'auto', background: '#E1F5EA', color: '#219653', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                    AMD Member
                                </span>
                            )}
                        </div>

                        <div className="card-body" style={{ padding: 24 }}>
                            <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                                <DetailItem icon={<FileText size={16} />} label="GST No" value={member.gst_no} />
                                <DetailItem icon={<FileText size={16} />} label="Pan Card No" value={member.pancard_no} />
                                <DetailItem icon={<Hash size={16} />} label="DIN No" value={member.din_no} />
                                <DetailItem
                                    icon={<Globe size={16} />}
                                    label="Website"
                                    value={member.website}
                                    href={member.website?.startsWith('http') ? member.website : `https://${member.website}`}
                                />
                                <DetailItem
                                    icon={<Hash size={16} />}
                                    label="Product-Wise Members Data"
                                    value={Array.isArray(member.hughes_no)
                                        ? member.hughes_no.filter((n: string) => n.trim() !== '').join(', ')
                                        : member.hughes_no}
                                />
                                <DetailItem icon={<MapPin size={16} />} label="Resi" value={member.resi} />
                            </div>
                        </div>
                    </div>

                    {/* Listed Products Section */}
                    <div className="card" style={{ border: '1px solid #EFEFEF', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                        <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid #F4F4F4', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Package size={20} color="#2F80ED" />
                            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Listed Products</h3>
                        </div>
                        <div className="card-body" style={{ padding: 24 }}>
                            {isProductsLoading ? (
                                <div style={{ textAlign: 'center' }}>Loading products...</div>
                            ) : memberProducts.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                                    {memberProducts.map(p => (
                                        <div key={p.id} style={{ border: '1px solid #EFEFEF', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, transition: 'all 0.2s', background: 'white' }}>
                                            <div style={{ width: '100%', aspectRatio: '1', background: '#F4F4F4', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                                                {p.images && (Array.isArray(p.images) ? p.images.length > 0 : typeof p.images === 'string') ? (
                                                    <img
                                                        src={Array.isArray(p.images) ? p.images[0] : p.images}
                                                        alt={p.product_name?.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3B3B3' }}>
                                                        <Package size={40} />
                                                    </div>
                                                )}
                                                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, color: '#1A1D1F' }}>
                                                    Qty: {p.quantity}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#1A1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.product_name?.name}>
                                                    {p.product_name?.name || 'Unknown Product'}
                                                </h4>
                                                <div style={{ fontSize: 13, color: '#6F767E', marginBottom: 8 }}>{p.category}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: 16, fontWeight: 700, color: '#2F80ED' }}>
                                                        ₹{p.price?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: 40, textAlign: 'center', color: '#6F767E' }}>
                                    <Package size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                                    <p style={{ margin: 0 }}>No products listed by this member</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attachments Section */}
                    {member.logo && (
                        <div className="card" style={{ border: '1px solid #EFEFEF', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                            <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid #F4F4F4', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <ImageIcon size={20} color="#2F80ED" />
                                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Attachments</h3>
                            </div>
                            <div className="card-body" style={{ padding: 24 }}>
                                <div style={{ width: 150, height: 150, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
                                    <img
                                        src={member.logo}
                                        alt="Logo Reference"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10 }}
                                    />
                                </div>
                                <div style={{ marginTop: 8, fontSize: 13, color: '#6F767E' }}>Member Logo</div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}


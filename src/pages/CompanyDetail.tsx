import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompanyStore } from '../store/companyStore';

export default function CompanyDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { selectedCompany, isLoading, fetchCompanyById } = useCompanyStore();

    useEffect(() => {
        if (id) {
            fetchCompanyById(Number(id));
        }
    }, [id, fetchCompanyById]);

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!selectedCompany) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <p>Company not found</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/companies')}>
                    Back to List
                </button>
            </div>
        );
    }

    const company = selectedCompany;
    const formatMno = (id: number) => `#A-${String(id).padStart(3, '0')}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Member Directory</h1>
            </div>

            <div className="detail-layout">
                {/* Profile Card */}
                <div className="profile-card card">
                    <div className="profile-avatar">
                        {company.logo ? (
                            <img
                                src={company.logo}
                                alt={company.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        ) : (
                            <span style={{ fontSize: 32, color: '#9A9FA5' }}>
                                {company.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h2 className="profile-name">{company.name}</h2>

                    <div className="profile-info">
                        <div className="profile-info-item">
                            <strong>Username:</strong>
                            <span>{company.name}</span>
                        </div>
                        <div className="profile-info-item">
                            <strong>Billing Email:</strong>
                            <span>{company.email}</span>
                        </div>
                        <div className="profile-info-item">
                            <strong>Factory Address:</strong>
                            <span>{company.address || '-'}</span>
                        </div>
                        <div className="profile-info-item">
                            <strong>City:</strong>
                            <span>{company.city || '-'}</span>
                        </div>
                        <div className="profile-info-item">
                            <strong>Contact:</strong>
                            <span>{company.mobile_number}</span>
                        </div>
                        <div className="profile-info-item">
                            <strong>Bank:</strong>
                            <span>{company.bank || '-'}</span>
                        </div>
                        <div className="profile-info-item">
                            <strong>Branch:</strong>
                            <span>{company.branch || '-'}</span>
                        </div>
                        <div className="profile-info-item">
                            <strong>Account Number:</strong>
                            <span>{company.account_number || '-'}</span>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 20 }}
                        onClick={() => navigate(`/companies/${id}/edit`)}
                    >
                        Edit Details
                    </button>
                </div>

                {/* Details Card */}
                <div className="detail-card card">
                    <div className="detail-header">
                        <button className="detail-back" onClick={() => navigate('/companies')}>
                            <ArrowLeft size={20} />
                        </button>
                        <span className="detail-id">{formatMno(company.id)}</span>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">GST No</span>
                            <span className="detail-value">{company.gst_no || '-'}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Pan Card No</span>
                            <span className="detail-value">{company.pancard_no || '-'}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">DIN No</span>
                            <span className="detail-value">{company.din_no || '-'}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Web Site</span>
                            <span className="detail-value">{company.website || '-'}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Product-Wise Members Data</span>
                            <span className="detail-value">
                                {Array.isArray(company.hughes_no) && company.hughes_no.length > 0
                                    ? company.hughes_no.filter(n => n.trim() !== '').join(', ')
                                    : company.hughes_no || '-'}
                            </span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Resi</span>
                            <span className="detail-value">{company.resi || '-'}</span>
                        </div>

                        <div className="detail-item">
                            <div className="form-checkbox">
                                <input type="checkbox" checked={company.amd} readOnly />
                                <label className="form-label">AMD</label>
                            </div>
                        </div>

                        <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                            <span className="detail-label">Attachments Logo</span>
                            <div className="image-upload" style={{ width: 100, height: 100, marginTop: 8 }}>
                                {company.logo ? (
                                    <img
                                        src={company.logo}
                                        alt="Logo"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <>
                                        <ImageIcon size={32} />
                                        <span>Image</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate('/companies')}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/companies/${id}/edit`)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

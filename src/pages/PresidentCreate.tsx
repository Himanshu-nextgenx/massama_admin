import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePresidentStore } from '../store/presidentStore';

export default function PresidentCreate() {
    const navigate = useNavigate();
    const { createPresident, isLoading } = usePresidentStore();
    const [formData, setFormData] = useState<{
        name: string;
        designation: string;
        years: string;
        profile_image: string | File;
        social_links: {
            linkedin: string;
            phone: string;
            whatsapp: string;
            instagram: string;
            facebook: string;
            twitter: string;
            youtube: string;
        };
    }>({
        name: '',
        designation: '',
        years: '',
        profile_image: '', // URL or File
        social_links: {
            linkedin: '',
            phone: '',
            whatsapp: '',
            instagram: '',
            facebook: '',
            twitter: '',
            youtube: ''
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPresident(formData);
        navigate('/presidents');
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Add President</h1>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    {/* Basic Info Section */}
                    <div className="form-grid" style={{ marginBottom: '24px' }}>
                        <div className="form-group">
                            <label>Name <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Designation <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.designation}
                                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Years (e.g. 2024-2025) <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.years}
                                onChange={e => setFormData({ ...formData, years: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Profile Image</label>
                            <input
                                type="file"
                                className="form-input"
                                accept="image/*"
                                onChange={e => setFormData({ ...formData, profile_image: e.target.files ? e.target.files[0] : '' })}
                            />
                        </div>
                    </div>

                    {/* Social Links Section */}
                    <div style={{
                        borderTop: '1px solid #E5E9F2',
                        paddingTop: '24px',
                        marginTop: '8px'
                    }}>
                        <h3 style={{
                            marginBottom: '16px',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#1A1D1F'
                        }}>Social Links</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Phone (Call)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="+91XXXXXXXXXX"
                                    value={formData.social_links.phone}
                                    onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, phone: e.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>WhatsApp Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="+91XXXXXXXXXX"
                                    value={formData.social_links.whatsapp}
                                    onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, whatsapp: e.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://linkedin.com/in/..."
                                    value={formData.social_links.linkedin}
                                    onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, linkedin: e.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Instagram URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://instagram.com/..."
                                    value={formData.social_links.instagram}
                                    onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, instagram: e.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Facebook URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://facebook.com/..."
                                    value={formData.social_links.facebook}
                                    onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, facebook: e.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Twitter/X URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://x.com/..."
                                    value={formData.social_links.twitter}
                                    onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, twitter: e.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>YouTube URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://youtube.com/..."
                                    value={formData.social_links.youtube}
                                    onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, youtube: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: '24px', borderTop: '1px solid #E5E9F2', paddingTop: '24px' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/presidents')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save President'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

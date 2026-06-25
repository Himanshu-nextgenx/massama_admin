import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTechnicalDetailStore } from '../store/technicalDetailStore';

export default function TechnicalDetailCreate() {
    const navigate = useNavigate();
    const { createTechnicalDetail, isLoading } = useTechnicalDetailStore();
    const [formData, setFormData] = useState({
        label_name: '',
        link: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createTechnicalDetail(formData);
        navigate('/technical-details');
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Add Technical Detail</h1>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid" style={{ marginBottom: '24px' }}>
                        <div className="form-group">
                            <label>Label Name <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Documentation, API Reference"
                                value={formData.label_name}
                                onChange={e => setFormData({ ...formData, label_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Link <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="url"
                                className="form-input"
                                placeholder="https://example.com"
                                value={formData.link}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: '24px', borderTop: '1px solid #E5E9F2', paddingTop: '24px' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/technical-details')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Technical Detail'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

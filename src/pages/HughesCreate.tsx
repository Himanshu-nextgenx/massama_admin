import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHughesStore } from '../store/hughesStore';

export default function HughesCreate() {
    const navigate = useNavigate();
    const { createHughes, isLoading } = useHughesStore();
    const [formData, setFormData] = useState({
        category: '',
        name: '',
        address: '',
        hughes1: '',
        hughes2: '',
        hughes3: '',
        hughes4: '',
        hughes5: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createHughes(formData);
        if (success) {
            navigate('/hughes');
        } else {
            alert('Failed to create Product-Wise Members Data entry');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Add Product-Wise Members Data</h1>
            </div>

            <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: 800 }}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g., S.S. SHEETS/PLATES/COILS"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Name *</label>
                        <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Company Name"
                        />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Address"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Entry 1</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.hughes1}
                            onChange={(e) => setFormData({ ...formData, hughes1: e.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Entry 2</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.hughes2}
                            onChange={(e) => setFormData({ ...formData, hughes2: e.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Entry 3</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.hughes3}
                            onChange={(e) => setFormData({ ...formData, hughes3: e.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Entry 4</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.hughes4}
                            onChange={(e) => setFormData({ ...formData, hughes4: e.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Entry 5</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.hughes5}
                            onChange={(e) => setFormData({ ...formData, hughes5: e.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                </div>

                <div className="form-actions" style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/hughes')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Data'}
                    </button>
                </div>
            </form>
        </div>
    );
}

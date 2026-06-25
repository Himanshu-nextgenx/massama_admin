import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryManagerModal from '../components/essential-contact/CategoryManagerModal';
import { useEssentialContactStore } from '../store/essentialContactStore';

export default function EssentialContactCreate() {
    const navigate = useNavigate();
    const { createContact, fetchCategories, categories, isLoading } = useEssentialContactStore();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        telephone_number: '',
        residence_number: '',
        category: null as any
    });
    const [error, setError] = useState<string | null>(null);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const success = await createContact(formData);
        if (success) {
            navigate('/essential-contacts');
        } else {
            const state = useEssentialContactStore.getState();
            if (state.error) {
                setError(state.error);
            } else {
                setError("Failed to create contact. Possible duplicate.");
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Add Essential Contact</h1>
            </div>

            {error && (
                <div className="alert alert-error mb-4" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    {error}
                    <button onClick={() => setError(null)} style={{ float: 'right', fontWeight: 'bold' }}>&times;</button>
                </div>
            )}

            <div className="card">
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    {/* New Fields */}
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.city}
                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Telephone Number</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.telephone_number}
                            onChange={e => setFormData({ ...formData, telephone_number: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Residence Number</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.residence_number}
                            onChange={e => setFormData({ ...formData, residence_number: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            ref={selectRef}
                            className="form-select"
                            onChange={e => {
                                if (e.target.value === '__add_new__') {
                                    setShowCategoryManager(true);
                                    if (selectRef.current) selectRef.current.value = ''; // Reset selection
                                    return;
                                }
                                setFormData({ ...formData, category: { id: parseInt(e.target.value) } });
                            }}
                            required
                        >
                            <option value="">Select Category</option>
                            {(categories || []).map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                            <option disabled>──────────</option>
                            <option value="__add_new__" style={{ fontWeight: 'bold', color: '#2563eb' }}>+ Add New Category</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/essential-contacts')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Contact'}
                        </button>
                    </div>
                </form>
            </div>

            {showCategoryManager && (
                <CategoryManagerModal onClose={() => {
                    setShowCategoryManager(false);
                    fetchCategories(); // Refresh list after closing
                }} />
            )}
        </div>
    );
}

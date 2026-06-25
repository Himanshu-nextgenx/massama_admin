import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEssentialContactStore } from '../store/essentialContactStore';
import api from '../utils/auth';

export default function EssentialContactEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { updateContact, fetchCategories, categories, isLoading } = useEssentialContactStore();
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

    useEffect(() => {
        fetchCategories();
        // Fetch current data
        const loadContact = async () => {
            try {
                // const response = await api.get(`/essential-contacts`); // Removed unused fetch
                // Let's implement fetchById in store later or just fetch full list then find for now to save time if backend doesn't support getOne (it does update though).
                // Actually, let's just use the list from store if populated, or fetch all.
                // Backend controller has findAllContacts but not findOne public endpoint?
                // Service has findOne helper for update return.
                // Let's assume we fetch all and find, or just rely on passing data? No, reloading page needs fetch.
                // BUT: the previous dev cycle didn't add fetchOne to store.
                // Hack: fetch all contacts, find the one.
                const res = await api.get('/essential-contacts');
                const contact = res.data.find((c: any) => c.id === Number(id));
                if (contact) {
                    setFormData({
                        name: contact.name,
                        phone: contact.phone,
                        address: contact.address || '',
                        city: contact.city || '',
                        telephone_number: contact.telephone_number || '',
                        residence_number: contact.residence_number || '',
                        category: contact.category
                    });
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadContact();
    }, [fetchCategories, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        // Ensure category is formatted correctly for update (id number)
        const payload = {
            ...formData,
            category: formData.category?.id ? { id: formData.category.id } : null
        };
        const success = await updateContact(Number(id), payload);
        if (success) {
            navigate('/essential-contacts');
        } else {
            const state = useEssentialContactStore.getState();
            if (state.error) {
                setError(state.error);
            } else {
                setError("Failed to update contact.");
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Edit Essential Contact</h1>
            </div>

            {error && (
                <div className="alert alert-error mb-4" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    {error}
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
                            className="form-select"
                            value={formData.category?.id || ''}
                            onChange={e => setFormData({ ...formData, category: { id: parseInt(e.target.value) } })}
                            required
                        >
                            <option value="">Select Category</option>
                            {(categories || []).map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
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
        </div>
    );
}

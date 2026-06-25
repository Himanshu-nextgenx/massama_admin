import { Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useEssentialContactStore, type EssentialContactCategory } from '../../store/essentialContactStore';

interface CategoryManagerModalProps {
    onClose: () => void;
}

export default function CategoryManagerModal({ onClose }: CategoryManagerModalProps) {
    const { categories, createCategory, updateCategory, deleteCategory } = useEssentialContactStore();
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setError(null);
        let success;

        if (editingId) {
            success = await updateCategory(editingId, { name });
        } else {
            success = await createCategory({ name });
        }

        if (success) {
            setName('');
            setEditingId(null);
        } else {
            setError('Failed to save category. It may already exist.');
        }
    };

    const handleEdit = (category: EssentialContactCategory) => {
        setName(category.name);
        setEditingId(category.id);
        setError(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const success = await deleteCategory(id);
            if (!success) {
                setError('Failed to delete category. It may be in use.');
            }
        }
    };

    const handleCancelEdit = () => {
        setName('');
        setEditingId(null);
        setError(null);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h3>Manage Categories</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {error && (
                        <div className="alert alert-error mb-4" style={{
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mb-6" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Category Name"
                                className="form-input"
                                style={{ flex: 1 }}
                                autoFocus
                            />
                            <button type="submit" className="btn btn-primary" style={{ minWidth: '80px' }}>
                                {editingId ? 'Update' : 'Add'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancelEdit}
                                    title="Cancel Edit"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="category-list" style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                    }}>
                        {categories.length === 0 ? (
                            <div className="p-4 text-center text-gray-500" style={{ padding: '1rem', color: '#6b7280' }}>
                                No categories. Add one above.
                            </div>
                        ) : (
                            categories.map(category => (
                                <div key={category.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.75rem 1rem',
                                    borderBottom: '1px solid #f3f4f6',
                                    backgroundColor: editingId === category.id ? '#f0f9ff' : 'transparent'
                                }}>
                                    <span style={{ fontWeight: 500 }}>{category.name}</span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="action-btn text-blue-600 hover:text-blue-800"
                                            onClick={() => handleEdit(category)}
                                            style={{ color: '#2563eb', padding: '4px' }}
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="action-btn text-red-600 hover:text-red-800"
                                            onClick={() => handleDelete(category.id)}
                                            style={{ color: '#dc2626', padding: '4px' }}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
}

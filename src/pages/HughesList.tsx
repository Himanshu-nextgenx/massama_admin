import { ChevronDown, Edit2, ExternalLink, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Hughes } from '../store/hughesStore';
import { useHughesStore } from '../store/hughesStore';

export default function HughesList() {
    const { hughesList, fetchHughes, updateHughes, deleteHughes, isLoading } = useHughesStore();
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'categories'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [editCategoryModal, setEditCategoryModal] = useState<{ oldCategory: string; newCategory: string } | null>(null);

    // Edit state
    const [editItem, setEditItem] = useState<Hughes | null>(null);
    const [editForm, setEditForm] = useState({
        category: '',
        name: '',
        address: '',
        hughes1: '',
        hughes2: '',
        hughes3: '',
        hughes4: '',
        hughes5: '',
    });

    useEffect(() => {
        fetchHughes();
    }, [fetchHughes]);

    // Get unique categories with counts
    const categories = Array.from(new Set(hughesList.map(h => h.category).filter(Boolean)));
    const categoryCounts = categories.reduce((acc, cat) => {
        acc[cat] = hughesList.filter(h => h.category === cat).length;
        return acc;
    }, {} as Record<string, number>);

    // Filter by category and search
    const filteredList = hughesList.filter(h => {
        const matchesCategory = activeTab === 'all' || !selectedCategory || h.category === selectedCategory;
        const matchesSearch = !searchTerm ||
            h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.category?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleTabChange = (tab: 'all' | 'categories') => {
        setActiveTab(tab);
        if (tab === 'all') {
            setSelectedCategory(null);
        }
    };

    const openEdit = (item: Hughes) => {
        setEditItem(item);
        setEditForm({
            category: item.category || '',
            name: item.name || '',
            address: item.address || '',
            hughes1: item.hughes1 || '',
            hughes2: item.hughes2 || '',
            hughes3: item.hughes3 || '',
            hughes4: item.hughes4 || '',
            hughes5: item.hughes5 || '',
        });
    };

    const handleEditSave = async () => {
        if (!editItem) return;
        const success = await updateHughes(editItem.id, editForm);
        if (success) {
            setEditItem(null);
        } else {
            alert('Failed to update entry');
        }
    };

    const handleCategoryRename = async () => {
        if (!editCategoryModal || !editCategoryModal.newCategory.trim()) return;
        const success = await useHughesStore.getState().renameCategory(
            editCategoryModal.oldCategory,
            editCategoryModal.newCategory.trim()
        );
        if (success) {
            setSelectedCategory(editCategoryModal.newCategory.trim());
            setEditCategoryModal(null);
        } else {
            alert('Failed to rename category');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Product-Wise Members Data</h1>
                <div className="page-actions">
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6F767E' }} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '40px', width: '200px' }}
                            />
                        </div>
                        <Link to="/hughes/create" className="btn btn-primary">
                            <Plus size={20} />
                            Add Data
                        </Link>
                    </div>
                </div>
            </div>

            {/* Two Tabs: All and Categories */}
            <div style={{
                display: 'flex',
                gap: '8px',
                padding: '12px 0',
                flexShrink: 0,
                alignItems: 'center'
            }}>
                <button
                    onClick={() => handleTabChange('all')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        backgroundColor: activeTab === 'all' ? '#5C6BC0' : '#E5E9F2',
                        color: activeTab === 'all' ? 'white' : '#1A1D1F',
                    }}
                >
                    All ({hughesList.length})
                </button>
                <button
                    onClick={() => handleTabChange('categories')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        backgroundColor: activeTab === 'categories' ? '#5C6BC0' : '#E5E9F2',
                        color: activeTab === 'categories' ? 'white' : '#1A1D1F',
                    }}
                >
                    Categories ({categories.length})
                </button>

                {/* Category Dropdown - shown when Categories tab is active */}
                {activeTab === 'categories' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => setSelectedCategory(e.target.value || null)}
                                className="form-input"
                                style={{
                                    paddingRight: '32px',
                                    minWidth: '280px',
                                    appearance: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">Select a category...</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat} ({categoryCounts[cat]})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6F767E',
                                pointerEvents: 'none'
                            }} />
                        </div>
                        {selectedCategory && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => setEditCategoryModal({ oldCategory: selectedCategory, newCategory: selectedCategory })}
                                title="Rename Category"
                                style={{ padding: '8px 12px' }}
                            >
                                <Edit2 size={16} />
                                Rename
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="data-table-container" style={{ flex: 1, overflow: 'auto', position: 'relative', background: 'white', borderRadius: '12px', border: '1px solid #E5E9F2' }}>
                {isLoading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                            <tr>
                                <th>Category</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Entry 1</th>
                                <th>Entry 2</th>
                                <th>Entry 3</th>
                                <th>Entry 4</th>
                                <th>Entry 5</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: 40 }}>
                                        <ExternalLink size={48} color="#6F767E" style={{ marginBottom: 16, opacity: 0.5, margin: '0 auto' }} />
                                        <p>No product-wise members data entries found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredList.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.category ? (
                                                <span className="badge">{item.category}</span>
                                            ) : '-'}
                                        </td>
                                        <td><div style={{ fontWeight: 500 }}>{item.name}</div></td>
                                        <td>{item.address || '-'}</td>
                                        <td>{item.hughes1 || '-'}</td>
                                        <td>{item.hughes2 || '-'}</td>
                                        <td>{item.hughes3 || '-'}</td>
                                        <td>{item.hughes4 || '-'}</td>
                                        <td>{item.hughes5 || '-'}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="action-btn view"
                                                    title="Edit"
                                                    onClick={() => openEdit(item)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    title="Delete"
                                                    onClick={() => setDeleteConfirm(item.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Modal */}
            {editItem && (
                <div className="modal-overlay" onClick={() => setEditItem(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
                        <div className="modal-header">
                            <h3>Edit Entry</h3>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        required
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={editForm.address}
                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Entry 1</label>
                                    <input type="text" className="form-input" value={editForm.hughes1} onChange={(e) => setEditForm({ ...editForm, hughes1: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Entry 2</label>
                                    <input type="text" className="form-input" value={editForm.hughes2} onChange={(e) => setEditForm({ ...editForm, hughes2: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Entry 3</label>
                                    <input type="text" className="form-input" value={editForm.hughes3} onChange={(e) => setEditForm({ ...editForm, hughes3: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Entry 4</label>
                                    <input type="text" className="form-input" value={editForm.hughes4} onChange={(e) => setEditForm({ ...editForm, hughes4: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Entry 5</label>
                                    <input type="text" className="form-input" value={editForm.hughes5} onChange={(e) => setEditForm({ ...editForm, hughes5: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setEditItem(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleEditSave} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {editCategoryModal && (
                <div className="modal-overlay" onClick={() => setEditCategoryModal(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500, width: '100%' }}>
                        <div className="modal-header">
                            <h3>Rename Category</h3>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">New Category Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editCategoryModal.newCategory}
                                    onChange={(e) => setEditCategoryModal({ ...editCategoryModal, newCategory: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCategoryRename()}
                                    autoFocus
                                />
                            </div>
                            <p style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
                                This will rename the category for <strong>{categoryCounts[editCategoryModal.oldCategory]}</strong> product entries.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setEditCategoryModal(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleCategoryRename} disabled={isLoading || !editCategoryModal.newCategory.trim()}>
                                {isLoading ? 'Saving...' : 'Rename'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this entry? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => {
                                deleteHughes(deleteConfirm);
                                setDeleteConfirm(null);
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

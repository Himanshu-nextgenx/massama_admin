import { ChevronDown, Edit2, Phone, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEssentialContactStore } from '../store/essentialContactStore';

export default function EssentialContactList() {
    const { contacts, categories, fetchContacts, fetchCategories, deleteContact, isLoading } = useEssentialContactStore();
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'categories'>('all');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchContacts(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchContacts]);

    // Get category counts
    const categoryCounts = categories.reduce((acc, cat) => {
        acc[cat.id] = contacts.filter(c => c.category?.id === cat.id).length;
        return acc;
    }, {} as Record<number, number>);

    // Filter contacts by selected category
    const filteredContacts = activeTab === 'all' || !selectedCategory
        ? contacts
        : contacts.filter(c => c.category?.id === selectedCategory);

    const handleTabChange = (tab: 'all' | 'categories') => {
        setActiveTab(tab);
        if (tab === 'all') {
            setSelectedCategory(null);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Essential Contacts</h1>
                <div className="page-actions">
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6F767E' }} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search contacts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '40px', width: '250px' }}
                            />
                        </div>
                        <Link to="/essential-contacts/create" className="btn btn-primary">
                            <Plus size={20} />
                            Add Contact
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
                    All ({contacts.length})
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
                    <div style={{ position: 'relative', marginLeft: '16px' }}>
                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                            className="form-input"
                            style={{
                                paddingRight: '32px',
                                minWidth: '250px',
                                appearance: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Select a category...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} ({categoryCounts[cat.id] || 0})
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
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!Array.isArray(filteredContacts) || filteredContacts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: 40 }}>
                                        <Phone size={48} color="#6F767E" style={{ marginBottom: 16, opacity: 0.5, margin: '0 auto' }} />
                                        <p>No contacts found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredContacts.map((contact) => (
                                    <tr key={contact.id}>
                                        <td><div style={{ fontWeight: 500 }}>{contact.name}</div></td>
                                        <td>{contact.phone}</td>
                                        <td>
                                            {contact.category?.name ? (
                                                <span className="badge">{contact.category.name}</span>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <Link
                                                    to={`/essential-contacts/${contact.id}/edit`}
                                                    className="action-btn edit"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    className="action-btn delete"
                                                    title="Delete"
                                                    onClick={() => setDeleteConfirm(contact.id)}
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

            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this contact? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => {
                                deleteContact(deleteConfirm);
                                setDeleteConfirm(null);
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

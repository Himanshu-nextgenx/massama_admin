import { ChevronLeft, ChevronRight, Edit2, Image as ImageIcon, Newspaper, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { NewsFormData, NewsItem } from '../store/newsStore';
import { useNewsStore } from '../store/newsStore';

const CATEGORIES = ['Market', 'Regulations', 'Events', 'Industry', 'Technology', 'Sustainability', 'General'];

export default function NewsList() {
    const {
        newsList,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalItems,
        fetchNews,
        createNews,
        updateNews,
        deleteNews,
    } = useNewsStore();

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        description: '',
        category: '',
        file: null,
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const openCreate = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', category: '', file: null });
        setPreviewUrl(null);
        setShowModal(true);
    };

    const openEdit = (item: NewsItem) => {
        setEditingId(item.id);
        setFormData({
            title: item.title,
            description: item.description || '',
            category: item.category || '',
            file: null,
        });
        setPreviewUrl(item.image || null);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            alert('Title is required');
            return;
        }
        let success: boolean;
        if (editingId) {
            success = await updateNews(editingId, formData);
        } else {
            success = await createNews(formData);
        }
        if (success) {
            setShowModal(false);
            setEditingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        const success = await deleteNews(id);
        if (success) setDeleteConfirm(null);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchNews(page);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData({ ...formData, file });
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">News</h1>
                <div className="page-actions">
                    <span style={{ fontSize: 14, color: '#666', marginRight: 10 }}>{totalItems} Articles</span>
                    <button className="btn btn-primary" onClick={openCreate}>
                        <Plus size={16} />
                        Create News
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16, flexShrink: 0 }}>
                    {error}
                </div>
            )}

            {/* News Grid */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {isLoading && newsList.length === 0 ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : newsList.length === 0 ? (
                    <div className="card" style={{ padding: 60, textAlign: 'center' }}>
                        <Newspaper size={56} color="#6F767E" style={{ marginBottom: 16, opacity: 0.4 }} />
                        <p style={{ color: '#6F767E', fontSize: 16 }}>No news articles yet. Create your first one!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {newsList.map((item: NewsItem) => (
                            <div key={item.id} className="card" style={{
                                display: 'flex',
                                flexDirection: 'row',
                                overflow: 'hidden',
                                transition: 'box-shadow 0.2s',
                            }}>
                                {/* Image */}
                                <div style={{
                                    width: 200,
                                    minHeight: 140,
                                    background: '#F4F4F5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <ImageIcon size={40} color="#6F767E" opacity={0.4} />
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{item.title}</h3>
                                        {item.description && (
                                            <p style={{
                                                fontSize: 14,
                                                color: '#6F767E',
                                                lineHeight: 1.5,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                                        {item.category && (
                                            <span style={{
                                                fontSize: 12,
                                                padding: '3px 10px',
                                                borderRadius: 12,
                                                backgroundColor: '#DBEAFE',
                                                color: '#2563EB',
                                                fontWeight: 600,
                                            }}>
                                                {item.category}
                                            </span>
                                        )}
                                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                                        </span>
                                        <div style={{ flex: 1 }} />
                                        <button className="action-btn view" title="Edit" onClick={() => openEdit(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 6 }}>
                                            <Edit2 size={16} color="#6F767E" />
                                        </button>
                                        <button className="action-btn delete" title="Delete" onClick={() => setDeleteConfirm(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 6 }}>
                                            <Trash2 size={16} color="#EF4444" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="table-footer" style={{ position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #E5E9F2', padding: '16px 20px', zIndex: 20, display: 'flex', justifyContent: 'space-between' }}>
                    <span className="results-count" style={{ alignSelf: 'center' }}>{totalItems} Results</span>
                    <div className="pagination">
                        <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                            <button key={page} className={`pagination-btn ${page === currentPage ? 'active' : ''}`} onClick={() => handlePageChange(page)}>
                                {page}
                            </button>
                        ))}
                        <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 550 }}>
                        <div className="modal-header">
                            <h3>{editingId ? 'Edit News' : 'Create News'}</h3>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <div className="form-group">
                                <label className="form-label">Title *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter news title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    placeholder="Enter news description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ resize: 'vertical', minHeight: 100 }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image</label>
                                <input
                                    type="file"
                                    className="form-input"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {previewUrl && (
                                    <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
                                {isLoading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
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
                            <h3>Delete News</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this news article? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

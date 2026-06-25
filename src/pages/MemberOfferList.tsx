import { ChevronLeft, ChevronRight, Eye, Gift, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MemberOfferEntity, MemberOfferFormData } from '../store/memberOfferStore';
import { useMemberOfferStore } from '../store/memberOfferStore';

export default function MemberOfferList() {
    const {
        offers,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalItems,
        fetchOffers,
        createOffer,
        deleteOffer,
    } = useMemberOfferStore();

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editOffer, setEditOffer] = useState<MemberOfferEntity | null>(null);
    const [viewOffer, setViewOffer] = useState<MemberOfferEntity | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState('recent');
    const [formData, setFormData] = useState<MemberOfferFormData>({
        title: '',
        description: '',
        category: '',
        start_date: '',
        end_date: '',
        is_active: true,
    });
    const [dateError, setDateError] = useState<string | null>(null);

    useEffect(() => {
        fetchOffers(1, 10, undefined, undefined, sort);
    }, [fetchOffers, sort]);

    useEffect(() => {
        if (formData.start_date || formData.end_date) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const start = formData.start_date ? new Date(formData.start_date) : null;
            const end = formData.end_date ? new Date(formData.end_date) : null;

            if (start && start < now) {
                setDateError("Start date can't be in the past");
            } else if (start && end && end < start) {
                setDateError("End date can't be earlier than start date");
            } else {
                setDateError(null);
            }
        } else {
            setDateError(null);
        }
    }, [formData.start_date, formData.end_date]);

    const handleSearch = () => {
        fetchOffers(1, 10, searchQuery || undefined, undefined, sort);
    };

    const handleDelete = async (id: number) => {
        const success = await deleteOffer(id);
        if (success) {
            setDeleteConfirm(null);
            fetchOffers(currentPage, 10, searchQuery || undefined, undefined, sort);
        }
    };

    const handleCreateOrUpdate = async () => {
        // Strict validation: Start Date cannot be past, End Date > Start Date
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);

        if (startDate < now) {
            alert('Start date cannot be in the past.');
            return;
        }

        if (endDate < startDate) {
            alert('End date cannot be earlier than start date.');
            return;
        }

        if (editOffer) {
            const success = await useMemberOfferStore.getState().updateOffer(editOffer.id, formData);
            if (success) {
                setShowCreateModal(false);
                setEditOffer(null);
                setFormData({
                    title: '',
                    description: '',
                    category: '',
                    start_date: '',
                    end_date: '',
                    is_active: true,
                });
                fetchOffers(currentPage, 10, searchQuery || undefined, undefined, sort);
            }
        } else {
            const success = await createOffer(formData);
            if (success) {
                setShowCreateModal(false);
                setFormData({
                    title: '',
                    description: '',
                    category: '',
                    start_date: '',
                    end_date: '',
                    is_active: true,
                });
                fetchOffers(1, 10, undefined, undefined, sort);
            }
        }
    };

    const openCreateModal = () => {
        setEditOffer(null);
        setFormData({
            title: '',
            description: '',
            category: '',
            start_date: '',
            end_date: '',
            is_active: true,
        });
        setShowCreateModal(true);
    };

    const openEditModal = (offer: MemberOfferEntity) => {
        setEditOffer(offer);
        setFormData({
            title: offer.title,
            description: offer.description || '',
            category: offer.category || '',
            start_date: offer.start_date.split('T')[0],
            end_date: offer.end_date.split('T')[0],
            is_active: offer.is_active,
        });
        setShowCreateModal(true);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchOffers(page, 10, searchQuery || undefined, undefined, sort);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Massma Updates</h1>
                <div className="page-actions">
                    <div style={{ display: 'flex', gap: 8 }}>
                        <select
                            className="form-input"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            style={{ width: 140 }}
                        >
                            <option value="recent">Recently Added</option>
                            <option value="time">Sort by Time</option>
                        </select>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search offers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            style={{ width: 200 }}
                        />
                        <button className="btn btn-secondary" onClick={handleSearch}>
                            <Search size={16} />
                        </button>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={openCreateModal}
                    >
                        <Plus size={16} />
                        Create Offer
                    </button>
                </div>
            </div>

            {error && (
                <div style={{
                    background: '#FEE2E2',
                    color: '#DC2626',
                    padding: '12px 16px',
                    borderRadius: 8,
                    marginBottom: 16,
                    flexShrink: 0
                }}>
                    {error}
                </div>
            )}

            <div className="data-table-container" style={{ flex: 1, overflow: 'auto', position: 'relative', background: 'white', borderRadius: '12px', border: '1px solid #E5E9F2' }}>
                {isLoading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        <table className="data-table">
                            <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Date Range</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                                            No member offers found. Click 'Create Offer' to add one.
                                        </td>
                                    </tr>
                                ) : (
                                    offers.map((offer: MemberOfferEntity) => {
                                        return (
                                            <tr key={offer.id}>
                                                <td>
                                                    <div className="logo-cell" style={{ width: 120, height: 80 }}>
                                                        {offer.image ? (
                                                            <img
                                                                src={offer.image}
                                                                alt={offer.title}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', background: '#E5E7EB', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Gift size={24} color="#6B7280" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{offer.title}</div>
                                                </td>
                                                <td>
                                                    {offer.category ? (
                                                        <span className="badge badge-info">{offer.category}</span>
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    {formatDate(offer.start_date)} - {formatDate(offer.end_date)}
                                                </td>
                                                <td>
                                                    <span className={`badge ${offer.is_active ? 'badge-success' : 'badge-error'}`}>
                                                        {offer.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="actions-cell">
                                                        <button
                                                            className="action-btn view"
                                                            title="View"
                                                            onClick={() => setViewOffer(offer)}
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            className="action-btn edit"
                                                            title="Edit"
                                                            onClick={() => openEditModal(offer)}
                                                            style={{ marginLeft: 8 }}
                                                        >
                                                            <span style={{ fontSize: 18 }}>✎</span>
                                                        </button>
                                                        <button
                                                            className="action-btn delete"
                                                            title="Delete"
                                                            onClick={() => setDeleteConfirm(offer.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>

                        {offers.length > 0 && (
                            <div className="table-footer" style={{ position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #E5E9F2', padding: '16px 20px', zIndex: 20 }}>
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                                <span className="results-count">{totalItems} Results Found</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create/Edit Offer Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h3>{editOffer ? 'Edit Member Offer' : 'Create New Member Offer'}</h3>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <div className="form-group">
                                <label className="form-label">Offer Title *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Start Date *</label>
                                    <input
                                        type="date"
                                        className={`form-input ${dateError && dateError.includes('Start') ? 'border-error' : ''}`}
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Date *</label>
                                    <input
                                        type="date"
                                        className={`form-input ${dateError && dateError.includes('End') ? 'border-error' : ''}`}
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            {dateError && (
                                <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontWeight: 'bold' }}>!</span> {dateError}
                                </p>
                            )}

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category / Tag (e.g. Exclusive, Reward)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Self-Esteem"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Offer Image</label>
                                <div style={{ border: '1px dashed #E5E9F2', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                                    <input
                                        type="file"
                                        id="offer-image-upload"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setFormData({ ...formData, file: e.target.files[0] });
                                            }
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="offer-image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                        {formData.file ? (
                                            <img
                                                src={URL.createObjectURL(formData.file)}
                                                alt="Preview"
                                                style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <>
                                                <Upload size={24} color="#6F767E" style={{ marginBottom: 8 }} />
                                                <span style={{ color: '#6F767E', fontSize: 14 }}>Click to upload image</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    Active (visible to members)
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreateOrUpdate}
                                disabled={isLoading || !formData.title || !formData.start_date || !formData.end_date}
                            >
                                {isLoading ? (editOffer ? 'Updating...' : 'Creating...') : (editOffer ? 'Update Offer' : 'Create Offer')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewOffer && (
                <div className="modal-overlay" onClick={() => setViewOffer(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
                        <div className="modal-header">
                            <h3>Offer Details</h3>
                            <button className="close-btn" onClick={() => setViewOffer(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                                <div style={{ width: 120, height: 120, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#f5f5f5' }}>
                                    {viewOffer.image && typeof viewOffer.image === 'string' ? (
                                        <img
                                            src={viewOffer.image as string}
                                            alt={viewOffer.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Gift size={40} color="#ccc" />
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ margin: '0 0 10px 0', fontSize: 20 }}>{viewOffer.title}</h2>
                                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                        <strong>Category:</strong> {viewOffer.category || '-'}
                                    </p>
                                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                        <strong>Valid:</strong> {formatDate(viewOffer.start_date)} - {formatDate(viewOffer.end_date)}
                                    </p>
                                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                        <strong>Status:</strong> <span className={`badge ${viewOffer.is_active ? 'badge-success' : 'badge-error'}`}>{viewOffer.is_active ? 'Active' : 'Inactive'}</span>
                                    </p>
                                </div>
                            </div>
                            {viewOffer.description && (
                                <div>
                                    <h4 style={{ marginBottom: 8 }}>Description</h4>
                                    <p style={{ lineHeight: 1.5, color: '#444' }}>{viewOffer.description}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setViewOffer(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this member offer? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(deleteConfirm)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

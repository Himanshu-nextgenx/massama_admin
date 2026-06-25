import { Calendar, ChevronLeft, ChevronRight, Eye, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { EventEntity, EventFormData } from '../store/eventStore';
import { useEventStore } from '../store/eventStore';

export default function EventList() {
    const {
        events,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalItems,
        fetchEvents,
        createEvent,
        deleteEvent,
    } = useEventStore();

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewEvent, setViewEvent] = useState<EventEntity | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState('recent');
    const [formData, setFormData] = useState<EventFormData>({
        name: '',
        date: '',
        time: '',
        description: '',
        country: '',
        city: '',
        address: '',
        landmark: '',
    });
    const [dateError, setDateError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchEvents(1, 10, undefined, 'event', sort);
    }, [fetchEvents, sort]);

    useEffect(() => {
        if (formData.date && formData.time) {
            const now = new Date();
            const [year, month, day] = formData.date.split('-').map(Number);
            const [hours, minutes] = formData.time.split(':').map(Number);
            const selectedDateTime = new Date(year, month - 1, day, hours, minutes);

            if (selectedDateTime < now) {
                setDateError("Date/Time can't be in the past");
            } else {
                setDateError(null);
            }
        } else if (formData.date) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const [year, month, day] = formData.date.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);
            if (selectedDate < now) {
                setDateError("Date can't be in the past");
            } else {
                setDateError(null);
            }
        } else {
            setDateError(null);
        }
    }, [formData.date, formData.time]);

    const handleSearch = () => {
        fetchEvents(1, 10, searchQuery || undefined, 'event', sort);
    };

    const handleDelete = async (id: number) => {
        const success = await deleteEvent(id);
        if (success) {
            setDeleteConfirm(null);
            fetchEvents(currentPage, 10, searchQuery || undefined, 'event', sort);
        }
    };

    const handleCreate = async () => {
        const now = new Date();
        const [year, month, day] = formData.date.split('-').map(Number);
        const [hours, minutes] = formData.time.split(':').map(Number);
        const selectedDateTime = new Date(year, month - 1, day, hours, minutes);

        if (selectedDateTime < now) {
            alert('Cannot create an event with a past date/time.');
            return;
        }

        const payload: EventFormData = { ...formData, type: 'event' };
        const success = await createEvent(payload);
        if (success) {
            setShowCreateModal(false);
            setFormData({
                name: '',
                date: '',
                time: '',
                description: '',
                country: '',
                city: '',
                address: '',
                landmark: '',
            });
            fetchEvents(1, 10, undefined, 'event', sort);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchEvents(page, 10, searchQuery || undefined, 'event', sort);
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

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        try {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } catch {
            return timeString;
        }
    };

    // Helper for custom time selection
    const [timeState, setTimeState] = useState({
        hour: '12',
        minute: '00',
        period: 'PM'
    });

    useEffect(() => {
        let hour = parseInt(timeState.hour);
        if (timeState.period === 'PM' && hour !== 12) hour += 12;
        if (timeState.period === 'AM' && hour === 12) hour = 0;
        const formattedHour = hour.toString().padStart(2, '0');
        setFormData(prev => ({ ...prev, time: `${formattedHour}:${timeState.minute}` }));
    }, [timeState]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Events</h1>
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
                            placeholder="Search events..."
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
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={16} />
                        Create Event
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
                                    <th>Name</th>
                                    <th>Date & Time</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
                                            No events found. Click 'Create Event' to add one.
                                        </td>
                                    </tr>
                                ) : (
                                    events.map((event: EventEntity) => (
                                        <tr key={event.id}>
                                            <td>
                                                <div className="logo-cell">
                                                    {event.image && typeof event.image === 'string' ? (
                                                        <img
                                                            src={event.image as string}
                                                            alt={event.name}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: 40, height: 40, background: '#E5E7EB', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Calendar size={20} color="#6B7280" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{event.name}</div>
                                            </td>
                                            <td>
                                                {formatDate(event.date)} at {formatTime(event.time)}
                                            </td>
                                            <td>
                                                {event.city}, {event.country}
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button
                                                        className="action-btn view"
                                                        title="View"
                                                        onClick={() => setViewEvent(event)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        title="Delete"
                                                        onClick={() => setDeleteConfirm(event.id)}
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

                        {events.length > 0 && (
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

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h3>Create New Event</h3>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <div className="form-group">
                                <label className="form-label">Event Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        setValidationErrors({ ...validationErrors, name: '' });
                                    }}
                                    style={{ borderColor: validationErrors.name ? '#EF4444' : undefined }}
                                />
                                {validationErrors.name && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.name}</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Date * (YYYY-MM-DD)</label>
                                    <input
                                        type="date"
                                        className={`form-input ${dateError ? 'border-error' : ''}`}
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                    {dateError && (
                                        <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{ fontWeight: 'bold' }}>!</span> {dateError}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Time * (AM/PM)</label>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <select
                                            className="form-input"
                                            value={timeState.hour}
                                            onChange={(e) => setTimeState({ ...timeState, hour: e.target.value })}
                                            style={{ flex: 1 }}
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                                                <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                        <span style={{ alignSelf: 'center' }}>:</span>
                                        <select
                                            className="form-input"
                                            value={timeState.minute}
                                            onChange={(e) => setTimeState({ ...timeState, minute: e.target.value })}
                                            style={{ flex: 1 }}
                                        >
                                            {Array.from({ length: 60 }, (_, i) => i).map(m => (
                                                <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="form-input"
                                            value={timeState.period}
                                            onChange={(e) => setTimeState({ ...timeState, period: e.target.value })}
                                            style={{ flex: 1 }}
                                        >
                                            <option value="AM">AM</option>
                                            <option value="PM">PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Country *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.country}
                                        onChange={(e) => {
                                            setFormData({ ...formData, country: e.target.value });
                                            setValidationErrors({ ...validationErrors, country: '' });
                                        }}
                                        style={{ borderColor: validationErrors.country ? '#EF4444' : undefined }}
                                    />
                                    {validationErrors.country && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.country}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.city}
                                        onChange={(e) => {
                                            setFormData({ ...formData, city: e.target.value });
                                            setValidationErrors({ ...validationErrors, city: '' });
                                        }}
                                        style={{ borderColor: validationErrors.city ? '#EF4444' : undefined }}
                                    />
                                    {validationErrors.city && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.city}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.address}
                                    onChange={(e) => {
                                        setFormData({ ...formData, address: e.target.value });
                                        setValidationErrors({ ...validationErrors, address: '' });
                                    }}
                                    style={{ borderColor: validationErrors.address ? '#EF4444' : undefined }}
                                />
                                {validationErrors.address && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.address}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Landmark</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.landmark}
                                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Event Image</label>
                                <input
                                    type="file"
                                    className="form-input"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] })}
                                />
                                {formData.file && (
                                    <div style={{ marginTop: 10, width: 200, height: 120 }}>
                                        <img
                                            src={URL.createObjectURL(formData.file)}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                        />
                                    </div>
                                )}
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
                                onClick={() => {
                                    const errors: any = {};
                                    if (!formData.name) errors.name = 'Event name is required';
                                    if (!formData.date) errors.date = 'Date is required';
                                    if (dateError) errors.date = dateError;
                                    if (!formData.time) errors.time = 'Time is required';
                                    if (!formData.country) errors.country = 'Country is required';
                                    if (!formData.city) errors.city = 'City is required';
                                    if (!formData.address) errors.address = 'Address is required';

                                    if (Object.keys(errors).length > 0) {
                                        setValidationErrors(errors);
                                        return;
                                    }
                                    handleCreate();
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Event'}
                            </button>
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
                            <p>Are you sure you want to delete this event? This action cannot be undone.</p>
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
            {/* View Details Modal */}
            {viewEvent && (
                <div className="modal-overlay" onClick={() => setViewEvent(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
                        <div className="modal-header">
                            <h3>Event Details</h3>
                            <button className="close-btn" onClick={() => setViewEvent(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                                <div style={{ width: 120, height: 120, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#f5f5f5' }}>
                                    {viewEvent.image && typeof viewEvent.image === 'string' ? (
                                        <img
                                            src={viewEvent.image as string}
                                            alt={viewEvent.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Calendar size={40} color="#ccc" />
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ margin: '0 0 10px 0', fontSize: 20 }}>{viewEvent.name}</h2>
                                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                        <strong>Date:</strong> {formatDate(viewEvent.date)}
                                    </p>
                                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                        <strong>Time:</strong> {formatTime(viewEvent.time)}
                                    </p>
                                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                        <strong>Location:</strong> {viewEvent.address}, {viewEvent.city}, {viewEvent.country}
                                    </p>
                                    {viewEvent.landmark && (
                                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                            <strong>Landmark:</strong> {viewEvent.landmark}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {viewEvent.description && (
                                <div>
                                    <h4 style={{ marginBottom: 8 }}>Description</h4>
                                    <p style={{ lineHeight: 1.5, color: '#444' }}>{viewEvent.description}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setViewEvent(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

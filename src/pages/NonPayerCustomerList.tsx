import { Plus, Trash2, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNonPayerCustomerStore, type NonPayerCustomer } from '../store/nonPayerCustomerStore';

export default function NonPayerCustomerList() {
    const { customers, fetchCustomers, createCustomer, updateCustomer, deleteCustomer, isLoading, error } = useNonPayerCustomerStore();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState({
        partyName: '',
        city: '',
        year: ''
    });

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleOpenModal = (customer?: NonPayerCustomer) => {
        if (customer) {
            setFormData({
                partyName: customer.partyName,
                city: customer.city,
                year: customer.year
            });
            setEditingId(customer.id);
        } else {
            setFormData({ partyName: '', city: '', year: '' });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ partyName: '', city: '', year: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let success = false;
        if (editingId) {
            success = await updateCustomer(editingId, formData);
        } else {
            success = await createCustomer(formData);
        }

        if (success) {
            handleCloseModal();
        }
    };

    const handleDelete = async (id: number) => {
        await deleteCustomer(id);
        setDeleteConfirm(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Non Payer Customers</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Add Customer
                </button>
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
                {isLoading && !isModalOpen && !deleteConfirm ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                            <tr>
                                <th>Party Name</th>
                                <th>City</th>
                                <th>Year</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: 40 }}>
                                        <p>No non payer customers found.</p>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td><div style={{ fontWeight: 500 }}>{customer.partyName}</div></td>
                                        <td>{customer.city}</td>
                                        <td>{customer.year}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="action-btn edit"
                                                    title="Edit"
                                                    onClick={() => handleOpenModal(customer)}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    title="Delete"
                                                    onClick={() => setDeleteConfirm(customer.id)}
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

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: '500px', maxWidth: '90%' }}>
                        <div className="modal-header">
                            <h3>{editingId ? 'Edit Customer' : 'Add Customer'}</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group" style={{ marginBottom: '16px' }}>
                                    <label>Party Name <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.partyName}
                                        onChange={e => setFormData({ ...formData, partyName: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '16px' }}>
                                    <label>City <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '16px' }}>
                                    <label>Year <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        placeholder="e.g. 2023-2024"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
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
                            <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
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

import { ChevronLeft, ChevronRight, Eye, Package, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMemberStore } from '../store/memberStore';
import type { MemberProduct, ProductSummary } from '../store/productStore';
import { useProductStore } from '../store/productStore';
import api from '../utils/auth';

// Catalog item type
interface CatalogItem {
    id: number;
    name: string;
    is_active?: boolean;
}

const formatLabel = (str?: string) => {
    if (!str) return '-';
    // Remove the 4-character suffix like -sq95, -a07v, etc.
    let cleaned = str.replace(/-[a-zA-Z0-9]{4}$/, '');
    // Replace underscores with space
    cleaned = cleaned.replace(/_+/g, ' ');
    return cleaned;
};

export default function ProductList() {
    const {
        memberProducts,
        summaries,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalItems,
        fetchCatalog,
        fetchMemberProducts,
        createMemberProduct,
        deleteMemberProduct,
    } = useProductStore();

    const { members, fetchMembers } = useMemberStore();

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCatalogId, setSelectedCatalogId] = useState<number | ''>('');
    const [searchTerm, setSearchTerm] = useState('');

    const [productTypes, setProductTypes] = useState<CatalogItem[]>([]);
    const [categories, setCategories] = useState<CatalogItem[]>([]);
    const [subCategories, setSubCategories] = useState<CatalogItem[]>([]);
    const [productNames, setProductNames] = useState<CatalogItem[]>([]);

    const [validationErrors, setValidationErrors] = useState<any>({});
    const [formData, setFormData] = useState<any>({
        product_name_id: 0,
        member_id: 0,
        type: '',
        category: '',
        sub_category: '',
        grade: '',
        quantity: 0,
        price: 0,
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchMemberProducts(currentPage, 10, selectedCatalogId || undefined, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchMemberProducts, selectedCatalogId, searchTerm, currentPage]);

    useEffect(() => {
        const load = async () => {
            await fetchCatalog();
            await fetchMembers();
            api.get('/catalog/product-types/active').then((res: any) => setProductTypes(res.data || [])).catch(() => { });
            api.get('/catalog/categories/active').then((res: any) => setCategories(res.data || [])).catch(() => { });
            api.get('/catalog/subcategories/active').then((res: any) => setSubCategories(res.data || [])).catch(() => { });
            api.get('/catalog/product-names/active').then((res: any) => setProductNames(res.data || [])).catch(() => { });
        };
        load();
    }, [fetchCatalog, fetchMembers]);

    const handleCreate = async () => {
        const success = await createMemberProduct(formData);
        if (success) {
            setShowCreateModal(false);
            setFormData({
                product_name_id: 0,
                member_id: 0,
                type: '',
                category: '',
                sub_category: '',
                grade: '',
                quantity: 0,
                price: 0,
            });
        }
    };

    const handleDelete = async (id: number) => {
        const success = await deleteMemberProduct(id);
        if (success) {
            setDeleteConfirm(null);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchMemberProducts(page, 10, selectedCatalogId || undefined, searchTerm);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            {/* <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Product List</h1>
                <div className="page-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={16} />
                        Add Data
                    </button>
                </div>
            </div> */}

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

            <div style={{ display: 'flex', gap: 24, flex: 1, overflow: 'hidden' }}>
                {/* Left Side: Master Products List */}
                <div style={{
                    width: 320,
                    background: 'white',
                    borderRadius: 12,
                    border: '1px solid #E5E9F2',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: 16, borderBottom: '1px solid #E5E9F2', background: '#F8FAFC' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Master Categories</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6F767E' }} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search Categories..."
                                style={{ paddingLeft: 36, width: '100%', fontSize: 13 }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                        {summaries.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 20, color: '#6F767E', fontSize: 13 }}>No categories found</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <button
                                    onClick={() => setSelectedCatalogId('')}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        textAlign: 'left',
                                        background: selectedCatalogId === '' ? '#EBF0FF' : 'transparent',
                                        border: 'none',
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        color: selectedCatalogId === '' ? '#4F7CFF' : '#1A1D1F',
                                        fontWeight: selectedCatalogId === '' ? 600 : 500,
                                        fontSize: 14,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span>All Products</span>
                                </button>
                                {summaries.map((product: ProductSummary) => (
                                    <button
                                        key={product.id}
                                        onClick={() => setSelectedCatalogId(product.id)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            textAlign: 'left',
                                            background: selectedCatalogId === product.id ? '#EBF0FF' : 'transparent',
                                            border: 'none',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            color: selectedCatalogId === product.id ? '#4F7CFF' : '#1A1D1F',
                                            fontWeight: selectedCatalogId === product.id ? 600 : 500,
                                            fontSize: 14,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Package size={16} />
                                            <span>{product.name}</span>
                                        </div>
                                        <span style={{
                                            background: selectedCatalogId === product.id ? '#4F7CFF' : '#E5E9F2',
                                            color: selectedCatalogId === product.id ? 'white' : '#6F767E',
                                            padding: '2px 8px',
                                            borderRadius: 10,
                                            fontSize: 11
                                        }}>{product.count}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Active Member Listings Table */}
                <div className="data-table-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div className="card-header" style={{ position: 'sticky', top: 0, zIndex: 25, background: 'white', borderBottom: '1px solid #E5E9F2', padding: '16px 20px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                                {selectedCatalogId ? `Listings for ${summaries.find(s => s.id === selectedCatalogId)?.name}` : 'All Member Listings'}
                            </h3>
                            <span style={{ fontSize: 13, color: '#6F767E' }}>{totalItems} Items</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflow: 'auto' }}>
                        {isLoading ? (
                            <div className="loading">
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                                    <tr>
                                        <th>ID</th>
                                        <th>PRODUCT</th>
                                        <th>MEMBER</th>
                                        <th>TYPE</th>
                                        <th>CATEGORY</th>
                                        <th>SUB CATEGORY</th>
                                        <th>GRADE</th>
                                        <th>QTY</th>
                                        <th>PRICE</th>
                                        <th>IMAGES</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={11} style={{ textAlign: 'center', padding: 40 }}>
                                                No products found for this category.
                                            </td>
                                        </tr>
                                    ) : (
                                        memberProducts.map((cp: MemberProduct) => (
                                            <tr key={cp.id}>
                                                <td>{cp.id}</td>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: '#1A1D1F' }}>{cp.product}</div>
                                                </td>
                                                <td>{cp.member?.name || '-'}</td>
                                                <td>
                                                    <span className="badge">{formatLabel(cp.type)}</span>
                                                </td>
                                                <td>
                                                    <span className="badge">{formatLabel(cp.category)}</span>
                                                </td>
                                                <td>
                                                    <span className="badge">{formatLabel(cp.sub_category)}</span>
                                                </td>
                                                <td>{cp.grade || '-'}</td>
                                                <td style={{ fontWeight: 600 }}>{cp.quantity}</td>
                                                <td style={{ fontWeight: 600, color: '#10B981' }}>₹{cp.price?.toLocaleString() || 0}</td>
                                                <td>{cp.images?.length || 0}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="action-btn view" title="View">
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            className="action-btn delete"
                                                            title="Delete"
                                                            onClick={() => setDeleteConfirm(cp.id)}
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

                    {!isLoading && memberProducts.length > 0 && (
                        <div className="table-footer" style={{ flexShrink: 0, background: 'white', borderTop: '1px solid #E5E9F2', padding: '16px 20px' }}>
                            <div className="pagination" style={{ padding: 0, border: 'none' }}>
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
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h3>Add Data</h3>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Product Name *</label>
                                    <select
                                        className={`form-input ${validationErrors.product_name_id ? 'border-red-500' : ''}`}
                                        value={formData.product_name_id || ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, product_name_id: parseInt(e.target.value) || 0 });
                                            setValidationErrors({ ...validationErrors, product_name_id: '' });
                                        }}
                                        style={{ borderColor: validationErrors.product_name_id ? '#EF4444' : undefined }}
                                    >
                                        <option value="">Select Product</option>
                                        {productNames.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {validationErrors.product_name_id && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.product_name_id}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Member *</label>
                                    <select
                                        className={`form-input ${validationErrors.member_id ? 'border-red-500' : ''}`}
                                        value={formData.member_id || ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, member_id: parseInt(e.target.value) || 0 });
                                            setValidationErrors({ ...validationErrors, member_id: '' });
                                        }}
                                        style={{ borderColor: validationErrors.member_id ? '#EF4444' : undefined }}
                                    >
                                        <option value="">Select Member</option>
                                        {members.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {validationErrors.member_id && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.member_id}</span>}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Type *</label>
                                    <select
                                        className={`form-input ${validationErrors.type ? 'border-red-500' : ''}`}
                                        value={formData.type}
                                        onChange={(e) => {
                                            setFormData({ ...formData, type: e.target.value });
                                            setValidationErrors({ ...validationErrors, type: '' });
                                        }}
                                        style={{ borderColor: validationErrors.type ? '#EF4444' : undefined }}
                                    >
                                        <option value="">Select Type</option>
                                        {productTypes.map((t) => (
                                            <option key={t.id} value={t.name}>{t.name}</option>
                                        ))}
                                    </select>
                                    {validationErrors.type && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.type}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select
                                        className={`form-input ${validationErrors.category ? 'border-red-500' : ''}`}
                                        value={formData.category}
                                        onChange={(e) => {
                                            setFormData({ ...formData, category: e.target.value });
                                            setValidationErrors({ ...validationErrors, category: '' });
                                        }}
                                        style={{ borderColor: validationErrors.category ? '#EF4444' : undefined }}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    {validationErrors.category && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.category}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Sub Category *</label>
                                    <select
                                        className={`form-input ${validationErrors.sub_category ? 'border-red-500' : ''}`}
                                        value={formData.sub_category}
                                        onChange={(e) => {
                                            setFormData({ ...formData, sub_category: e.target.value });
                                            setValidationErrors({ ...validationErrors, sub_category: '' });
                                        }}
                                        style={{ borderColor: validationErrors.sub_category ? '#EF4444' : undefined }}
                                    >
                                        <option value="">Select Sub Category</option>
                                        {subCategories.map((sc) => (
                                            <option key={sc.id} value={sc.name}>{sc.name}</option>
                                        ))}
                                    </select>
                                    {validationErrors.sub_category && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.sub_category}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Grade *</label>
                                <input
                                    type="text"
                                    className={`form-input ${validationErrors.grade ? 'border-red-500' : ''}`}
                                    value={formData.grade}
                                    onChange={(e) => {
                                        setFormData({ ...formData, grade: e.target.value });
                                        setValidationErrors({ ...validationErrors, grade: '' });
                                    }}
                                    style={{ borderColor: validationErrors.grade ? '#EF4444' : undefined }}
                                />
                                {validationErrors.grade && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.grade}</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Quantity *</label>
                                    <input
                                        type="number"
                                        className={`form-input ${validationErrors.quantity ? 'border-red-500' : ''}`}
                                        value={formData.quantity || ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 });
                                            setValidationErrors({ ...validationErrors, quantity: '' });
                                        }}
                                        style={{ borderColor: validationErrors.quantity ? '#EF4444' : undefined }}
                                    />
                                    {validationErrors.quantity && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.quantity}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (₹) *</label>
                                    <input
                                        type="number"
                                        className={`form-input ${validationErrors.price ? 'border-red-500' : ''}`}
                                        value={formData.price || ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
                                            setValidationErrors({ ...validationErrors, price: '' });
                                        }}
                                        style={{ borderColor: validationErrors.price ? '#EF4444' : undefined }}
                                    />
                                    {validationErrors.price && <span style={{ color: '#EF4444', fontSize: 12 }}>{validationErrors.price}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Images (max 5)</label>
                                <input
                                    type="file"
                                    className="form-input"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []).slice(0, 5);
                                        setFormData({ ...formData, files });
                                    }}
                                />
                                {formData.files && formData.files.length > 0 && (
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                        {formData.files.map((file: any, index: number) => (
                                            <div key={index} style={{ width: 60, height: 60, position: 'relative' }}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Preview"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const errors: any = {};
                                    if (!formData.product_name_id) errors.product_name_id = 'Product is required';
                                    if (!formData.member_id) errors.member_id = 'Member is required';
                                    if (!formData.type) errors.type = 'Type is required';
                                    if (!formData.category) errors.category = 'Category is required';
                                    if (!formData.sub_category) errors.sub_category = 'Sub Category is required';
                                    if (!formData.grade) errors.grade = 'Grade is required';
                                    if (!formData.quantity) errors.quantity = 'Quantity is required';
                                    if (!formData.price) errors.price = 'Price is required';

                                    if (Object.keys(errors).length > 0) {
                                        setValidationErrors(errors);
                                        return;
                                    }
                                    handleCreate();
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Add Data'}
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
                            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
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

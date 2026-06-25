import { ChevronLeft, ChevronRight, Eye, Filter, Package, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type {
    MemberProduct,
    MemberProductCategory,
    MemberProductFormData,
    MemberProductSubCategory,
    MemberProductType,
} from '../store/memberProductStore';
import { useMemberProductStore } from '../store/memberProductStore';
import { useMemberStore } from '../store/memberStore';
import api from '../utils/auth';

// Catalog item type
interface CatalogItem {
    id: number;
    name: string;
    is_active?: boolean;
}

const formatLabel = (str?: string) => {
    if (!str) return '-';
    // Remove the 4-character suffix
    let cleaned = str.replace(/-[a-zA-Z0-9]{4}$/, '');
    // Replace underscores with space
    cleaned = cleaned.replace(/_+/g, ' ');
    return cleaned;
};

export default function MemberProductList() {
    const {
        memberProducts,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalItems,
        fetchMemberProducts,
        createMemberProduct,
        deleteMemberProduct,
    } = useMemberProductStore();

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Filter state
    const [filterType, setFilterType] = useState<MemberProductType | ''>('');
    const [filterCategory, setFilterCategory] = useState<MemberProductCategory | ''>('');
    const [filterSubCategory, setFilterSubCategory] = useState<MemberProductSubCategory | ''>('');
    const [filterProductNameId, setFilterProductNameId] = useState<number | 0>(0);

    // View state
    const [viewProduct, setViewProduct] = useState<MemberProduct | null>(null);

    // Form data
    const [formData, setFormData] = useState<MemberProductFormData>({
        product_name_id: 0,
        member_id: 0,
        type: '' as MemberProductType,
        category: '' as MemberProductCategory,
        sub_category: '' as MemberProductSubCategory,
        grade: '',
        quantity: 0,
        price: 0,
    });

    // Member store for dropdown
    const { members, fetchMembers } = useMemberStore();

    // Catalog data for dropdowns
    const [productTypes, setProductTypes] = useState<CatalogItem[]>([]);
    const [categories, setCategories] = useState<CatalogItem[]>([]);
    const [subCategories, setSubCategories] = useState<CatalogItem[]>([]);
    const [productNames, setProductNames] = useState<CatalogItem[]>([]);

    useEffect(() => {
        fetchMemberProducts();
        fetchMembers();
        // Fetch catalog data
        api.get('/catalog/product-types/active').then((res: any) => setProductTypes(res.data || [])).catch(() => { });
        api.get('/catalog/categories/active').then((res: any) => setCategories(res.data || [])).catch(() => { });
        api.get('/catalog/subcategories/active').then((res: any) => setSubCategories(res.data || [])).catch(() => { });
        api.get('/catalog/product-names/active').then((res: any) => setProductNames(res.data || [])).catch(() => { });
    }, [fetchMemberProducts, fetchMembers]);

    const handleFilter = () => {
        fetchMemberProducts({
            page: 1,
            limit: 10,
            type: filterType || undefined,
            category: filterCategory || undefined,
            sub_category: filterSubCategory || undefined,
            product_name_id: filterProductNameId || undefined,
        });
    };

    const handleDelete = async (id: number) => {
        const success = await deleteMemberProduct(id);
        if (success) {
            setDeleteConfirm(null);
        }
    };

    const handleCreate = async () => {
        const success = await createMemberProduct(formData);
        if (success) {
            setShowCreateModal(false);
            setFormData({
                product_name_id: 0,
                member_id: 0,
                type: '' as MemberProductType,
                category: '' as MemberProductCategory,
                sub_category: '' as MemberProductSubCategory,
                grade: '',
                quantity: 0,
                price: 0,
            });
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchMemberProducts({ page, limit: 10 });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Member Products</h1>
                <div className="page-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={16} />
                        Filters
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={16} />
                        Add Member Product
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="card" style={{ padding: 16, marginBottom: 16, flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Type</label>
                            <select
                                className="form-input"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as MemberProductType | '')}
                                style={{ width: 150 }}
                            >
                                <option value="">All Types</option>
                                {productTypes.map((t) => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Category</label>
                            <select
                                className="form-input"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value as MemberProductCategory | '')}
                                style={{ width: 150 }}
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Sub Category</label>
                            <select
                                className="form-input"
                                value={filterSubCategory}
                                onChange={(e) => setFilterSubCategory(e.target.value as MemberProductSubCategory | '')}
                                style={{ width: 150 }}
                            >
                                <option value="">All Sub Cats</option>
                                {subCategories.map((sc) => (
                                    <option key={sc.id} value={sc.name}>{sc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Product Name</label>
                            <select
                                className="form-input"
                                value={filterProductNameId || ''}
                                onChange={(e) => setFilterProductNameId(parseInt(e.target.value) || 0)}
                                style={{ width: 150 }}
                            >
                                <option value="">All Products</option>
                                {productNames.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={handleFilter}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

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
                                    <th>ID</th>
                                    <th>PRODUCT</th>
                                    <th>MEMBER</th>
                                    <th>TYPE</th>
                                    <th>CATEGORY</th>
                                    <th>SUB CAT</th>
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
                                            <Package size={48} color="#6F767E" style={{ marginBottom: 16, opacity: 0.5, margin: '0 auto' }} />
                                            <p>No member products found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    memberProducts.map((cp: MemberProduct) => (
                                        <tr key={cp.id}>
                                            <td>{cp.id}</td>
                                            <td>{cp.product_name?.name || `#${cp.product_name_id}`}</td>
                                            <td>{cp.member?.name || 'Admin'}</td>
                                            <td><span className="badge">{formatLabel(cp.type)}</span></td>
                                            <td><span className="badge">{formatLabel(cp.category)}</span></td>
                                            <td><span className="badge">{formatLabel(cp.sub_category)}</span></td>
                                            <td>{cp.grade || '-'}</td>
                                            <td>{cp.quantity}</td>
                                            <td>₹{cp.price?.toLocaleString() || 0}</td>
                                            <td>
                                                {cp.images?.length > 0 ? (
                                                    <div style={{ display: 'flex', gap: 4 }}>
                                                        {cp.images.slice(0, 3).map((img, i) => (
                                                            <img
                                                                key={i}
                                                                src={img}
                                                                alt=""
                                                                style={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: 4,
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        ))}
                                                        {cp.images.length > 3 && (
                                                            <span style={{ fontSize: 12, color: '#6F767E' }}>
                                                                +{cp.images.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#6F767E' }}>-</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button className="action-btn view" title="View" onClick={() => setViewProduct(cp)}>
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

                        {memberProducts.length > 0 && (
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

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h3>Add Member Product</h3>
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
                                            setFormData({ ...formData, type: e.target.value as MemberProductType });
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
                                            setFormData({ ...formData, category: e.target.value as MemberProductCategory });
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
                                            setFormData({ ...formData, sub_category: e.target.value as MemberProductSubCategory });
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
                                        {formData.files.map((file, index) => (
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
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* View Product Modal */}
            {
                viewProduct && (
                    <div className="modal-overlay" onClick={() => setViewProduct(null)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
                            <div className="modal-header">
                                <h3>Product Details</h3>
                                <button className="close-btn" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => setViewProduct(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                    <div>
                                        <p><strong>Product:</strong> {viewProduct.product_name?.name || viewProduct.product?.name}</p>
                                        <p><strong>Member:</strong> {viewProduct.member?.name || 'Admin'}</p>
                                        <p><strong>Type:</strong> <span className="badge">{formatLabel(viewProduct.type)}</span></p>
                                        <p><strong>Category:</strong> <span className="badge">{formatLabel(viewProduct.category)}</span></p>
                                        <p><strong>Sub Category:</strong> <span className="badge">{formatLabel(viewProduct.sub_category)}</span></p>
                                    </div>
                                    <div>
                                        <p><strong>Grade:</strong> {viewProduct.grade}</p>
                                        <p><strong>Quantity:</strong> {viewProduct.quantity}</p>
                                        <p><strong>Price:</strong> ₹{viewProduct.price?.toLocaleString()}</p>
                                    </div>
                                </div>

                                {viewProduct.images && viewProduct.images.length > 0 && (
                                    <div style={{ marginTop: 20 }}>
                                        <h4>Images</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10, marginTop: 10 }}>
                                            {viewProduct.images.map((img, i) => (
                                                <div key={i} style={{ aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
                                                    <img
                                                        src={img}
                                                        alt={`Product ${i + 1}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onClick={() => window.open(img, '_blank')}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setViewProduct(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Modal */}
            {
                deleteConfirm && (
                    <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Delete Member Product</h3>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this member product? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                                    Cancel
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

import { ChevronLeft, ChevronRight, Eye, Filter, Package, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type {
    CompanyProduct,
    CompanyProductCategory,
    CompanyProductFormData,
    CompanyProductSubCategory,
    CompanyProductType,
} from '../store/companyProductStore';
import { useCompanyProductStore } from '../store/companyProductStore';
import { useCompanyStore } from '../store/companyStore';
import api from '../utils/auth';

// Catalog item type
interface CatalogItem {
    id: number;
    name: string;
    is_active?: boolean;
}

export default function CompanyProductList() {
    const {
        companyProducts,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalItems,
        fetchCompanyProducts,
        createCompanyProduct,
        deleteCompanyProduct,
    } = useCompanyProductStore();

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Filter state
    const [filterType, setFilterType] = useState<CompanyProductType | ''>('');
    const [filterCategory, setFilterCategory] = useState<CompanyProductCategory | ''>('');

    // Form data
    const [formData, setFormData] = useState<CompanyProductFormData>({
        product_name_id: 0,
        company_id: 0,
        type: '' as CompanyProductType,
        category: '' as CompanyProductCategory,
        sub_category: '' as CompanyProductSubCategory,
        grade: '',
        quantity: 0,
        price: 0,
    });

    // Company store for dropdown
    const { companies, fetchCompanies } = useCompanyStore();

    // Catalog data for dropdowns
    const [productTypes, setProductTypes] = useState<CatalogItem[]>([]);
    const [categories, setCategories] = useState<CatalogItem[]>([]);
    const [subCategories, setSubCategories] = useState<CatalogItem[]>([]);
    const [productNames, setProductNames] = useState<CatalogItem[]>([]);

    useEffect(() => {
        fetchCompanyProducts();
        fetchCompanies();
        // Fetch catalog data
        api.get('/catalog/product-types/active').then(res => setProductTypes(res.data || [])).catch(() => { });
        api.get('/catalog/categories/active').then(res => setCategories(res.data || [])).catch(() => { });
        api.get('/catalog/subcategories/active').then(res => setSubCategories(res.data || [])).catch(() => { });
        api.get('/catalog/product-names/active').then(res => setProductNames(res.data || [])).catch(() => { });
    }, [fetchCompanyProducts, fetchCompanies]);

    const handleFilter = () => {
        fetchCompanyProducts({
            page: 1,
            limit: 10,
            type: filterType || undefined,
            category: filterCategory || undefined,
        });
    };

    const handleDelete = async (id: number) => {
        const success = await deleteCompanyProduct(id);
        if (success) {
            setDeleteConfirm(null);
        }
    };

    const handleCreate = async () => {
        const success = await createCompanyProduct(formData);
        if (success) {
            setShowCreateModal(false);
            setFormData({
                product_name_id: 0,
                company_id: 0,
                type: '' as CompanyProductType,
                category: '' as CompanyProductCategory,
                sub_category: '' as CompanyProductSubCategory,
                grade: '',
                quantity: 0,
                price: 0,
            });
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchCompanyProducts({ page, limit: 10 });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Company Products</h1>
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
                        Add Company Product
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="card" style={{ padding: 16, marginBottom: 16, flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Type</label>
                            <select
                                className="form-input"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as CompanyProductType | '')}
                                style={{ width: 150 }}
                            >
                                <option value="">All Types</option>
                                <option value="TYPE_A">Type A</option>
                                <option value="TYPE_B">Type B</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Category</label>
                            <select
                                className="form-input"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value as CompanyProductCategory | '')}
                                style={{ width: 150 }}
                            >
                                <option value="">All Categories</option>
                                <option value="CATEGORY_A">Category A</option>
                                <option value="CATEGORY_B">Category B</option>
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
                                    <th>COMPANY</th>
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
                                {companyProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} style={{ textAlign: 'center', padding: 40 }}>
                                            <Package size={48} color="#6F767E" style={{ marginBottom: 16, opacity: 0.5, margin: '0 auto' }} />
                                            <p>No company products found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    companyProducts.map((cp: CompanyProduct) => (
                                        <tr key={cp.id}>
                                            <td>{cp.id}</td>
                                            <td>{cp.product?.name || `#${cp.product_name_id}`}</td>
                                            <td>{cp.company?.name || `#${cp.company_id}`}</td>
                                            <td><span className="badge">{cp.type}</span></td>
                                            <td><span className="badge">{cp.category}</span></td>
                                            <td><span className="badge">{cp.sub_category}</span></td>
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

                        {companyProducts.length > 0 && (
                            <div className="table-footer" style={{ position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #E5E9F2', padding: '16px 20px', zIndex: 20 }}>
                                <span className="results-count">{totalItems} Results Found</span>
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
                            <h3>Add Company Product</h3>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Product Name *</label>
                                    <select
                                        className="form-input"
                                        value={formData.product_name_id || ''}
                                        onChange={(e) => setFormData({ ...formData, product_name_id: parseInt(e.target.value) || 0 })}
                                    >
                                        <option value="">Select Product</option>
                                        {productNames.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company *</label>
                                    <select
                                        className="form-input"
                                        value={formData.company_id || ''}
                                        onChange={(e) => setFormData({ ...formData, company_id: parseInt(e.target.value) || 0 })}
                                    >
                                        <option value="">Select Company</option>
                                        {companies.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Type *</label>
                                    <select
                                        className="form-input"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as CompanyProductType })}
                                    >
                                        <option value="">Select Type</option>
                                        {productTypes.map((t) => (
                                            <option key={t.id} value={t.name}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select
                                        className="form-input"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as CompanyProductCategory })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Sub Category *</label>
                                    <select
                                        className="form-input"
                                        value={formData.sub_category}
                                        onChange={(e) => setFormData({ ...formData, sub_category: e.target.value as CompanyProductSubCategory })}
                                    >
                                        <option value="">Select Sub Category</option>
                                        {subCategories.map((sc) => (
                                            <option key={sc.id} value={sc.name}>{sc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Grade *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Quantity *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.quantity || ''}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (₹) *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.price || ''}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Images (max 5)</label>
                                <input
                                    type="file"
                                    className="form-input"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setFormData({ ...formData, files: Array.from(e.target.files || []).slice(0, 5) })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreate}
                                disabled={isLoading || !formData.product_name_id || !formData.company_id || !formData.grade}
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Company Product</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this company product? This action cannot be undone.</p>
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
            )}
        </div>
    );
}

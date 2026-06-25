import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadExcelModal from '../components/company/UploadExcelModal';
import type { Company } from '../store/companyStore';
import { useCompanyStore } from '../store/companyStore';

export default function CompanyList() {
    const navigate = useNavigate();
    const {
        companies,
        isLoading,
        currentPage,
        totalPages,
        totalItems,
        fetchCompanies,
        updateCompany,
        deleteCompany
    } = useCompanyStore();

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCompanies(1, 100, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchCompanies]);

    const handleToggleAmd = async (id: number, currentStatus: boolean | undefined) => {
        try {
            await updateCompany(id, { amd: !currentStatus });
        } catch (error) {
            console.error('Failed to toggle AMD status:', error);
            alert('Failed to update AMD status');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            await deleteCompany(id);
        }
    };

    const handlePageChange = (page: number) => {
        fetchCompanies(page, 100, searchTerm);
    };

    const formatMno = (id: number) => `#A-${String(id).padStart(3, '0')}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Member Directory</h1>
                <div className="page-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div className="search-box" style={{ position: 'relative', marginRight: '10px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6F767E' }} />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '8px 8px 8px 36px',
                                borderRadius: '8px',
                                border: '1px solid #EFEFEF',
                                fontSize: '14px',
                                outline: 'none',
                                width: '250px'
                            }}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/companies/create')}>
                        <Plus size={18} />
                        Create
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                        <Upload size={18} />
                        Excel
                    </button>
                </div>
            </div>

            <div className="data-table-container" style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                {isLoading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        <table className="data-table" style={{ width: 'max-content', minWidth: '100%' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                                <tr>
                                    <th>Mno</th>
                                    <th>Logo</th>
                                    <th>Company Name</th>
                                    <th>Gst No</th>
                                    <th>Pan Card No</th>
                                    <th>DIN NO</th>
                                    <th>Web Site</th>
                                    <th>Product-Wise Members Data</th>
                                    <th>Mobile No</th>
                                    <th>Resi</th>
                                    <th>AMD</th>
                                    <th>Email Id</th>
                                    <th>Factory Address</th>
                                    <th>City</th>
                                    <th>Bank</th>
                                    <th>Account Number</th>
                                    <th style={{ position: 'sticky', right: 0, background: '#0F3642', zIndex: 21, boxShadow: '-2px 0 5px rgba(0,0,0,0.05)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.length === 0 ? (
                                    <tr>
                                        <td colSpan={17} className="text-center" style={{ padding: '40px' }}>
                                            No companies found. Click "Create" to add one.
                                        </td>
                                    </tr>
                                ) : (
                                    companies.map((company: Company) => (
                                        <tr key={company.id}>
                                            <td>{formatMno(company.id)}</td>
                                            <td className="logo-cell">
                                                {company.logo ? (
                                                    <img src={company.logo} alt={company.name} />
                                                ) : (
                                                    <div style={{
                                                        width: 40,
                                                        height: 40,
                                                        background: '#f0f2f5',
                                                        borderRadius: 4,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 12,
                                                        color: '#6F767E'
                                                    }}>
                                                        N/A
                                                    </div>
                                                )}
                                            </td>
                                            <td>{company.name}</td>
                                            <td>{company.gst_no || '-'}</td>
                                            <td>{company.pancard_no || '-'}</td>
                                            <td>{company.din_no || '-'}</td>
                                            <td>{company.website || '-'}</td>
                                            <td>{Array.isArray(company.hughes_no) && company.hughes_no.length > 0 ? company.hughes_no[0] : '-'}</td>
                                            <td>{company.mobile_number}</td>
                                            <td>{company.resi || '-'}</td>
                                            <td className="checkbox-cell">
                                                <input
                                                    type="checkbox"
                                                    checked={company.amd || false}
                                                    onChange={() => handleToggleAmd(company.id, company.amd)}
                                                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                />
                                            </td>
                                            <td>{company.email}</td>
                                            <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {company.address}
                                            </td>
                                            <td>{company.city || '-'}</td>
                                            <td>{company.bank || '-'}</td>
                                            <td>{company.account_number || '-'}</td>
                                            <td style={{ position: 'sticky', right: 0, background: 'white', zIndex: 10, boxShadow: '-2px 0 5px rgba(0,0,0,0.05)' }}>
                                                <div className="actions-cell">
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => navigate(`/companies/${company.id}`)}
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => navigate(`/companies/${company.id}/edit`)}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => handleDelete(company.id)}
                                                        title="Delete"
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
                    </>
                )}
                {!isLoading && companies.length > 0 && (
                    <div className="pagination" style={{
                        position: 'sticky',
                        bottom: 0,
                        background: 'white',
                        borderTop: '1px solid #E5E9F2',
                        padding: '16px 20px',
                        zIndex: 20,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <span className="pagination-info" style={{ color: '#6F767E', fontSize: '14px' }}>
                            {totalItems} Results • Page {currentPage} of {totalPages}
                        </span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                title="First Page"
                            >
                                {'<<'}
                            </button>
                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                title="Previous Page"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                title="Next Page"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                title="Last Page"
                            >
                                {'>>'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showUploadModal && (
                <UploadExcelModal onClose={() => setShowUploadModal(false)} />
            )}
        </div>
    );
}

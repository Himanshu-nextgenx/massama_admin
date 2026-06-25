import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadExcelModal from '../components/company/UploadExcelModal';
import type { Member } from '../store/memberStore';
import { useMemberStore } from '../store/memberStore';

export default function MemberList() {
    const navigate = useNavigate();
    const {
        members,
        isLoading,
        currentPage,
        totalPages,
        totalItems,
        fetchMembers,
        updateMember,
        deleteMember,
        deleteAllMembers,
        toggleMemberAccess
    } = useMemberStore();

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('recent');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchMembers(1, 100, searchTerm, sort);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, sort, fetchMembers]);

    const handleToggleAmd = async (id: number, currentStatus: boolean | undefined) => {
        try {
            await updateMember(id, { amd: !currentStatus });
        } catch (error) {
            console.error('Failed to toggle AMD status:', error);
            alert('Failed to update AMD status');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            await deleteMember(id);
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm('ARE YOU SURE? This will permanently delete ALL members and their data. This action cannot be undone.')) {
            if (window.confirm('Please confirm again. Do you really want to wipe the entire member database?')) {
                await deleteAllMembers();
            }
        }
    };

    const handlePageChange = (page: number) => {
        fetchMembers(page, 100, searchTerm, sort);
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
                            placeholder="Search members..."
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
                    <select
                        className="form-input"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{ width: 140 }}
                    >
                        <option value="recent">Recently Added</option>
                        <option value="alpha">Alphabetical</option>
                    </select>
                    <button className="btn btn-primary" onClick={() => navigate('/members/create')}>
                        <Plus size={18} />
                        Create
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                        <Upload size={18} />
                        Excel
                    </button>
                    <button className="btn btn-danger" onClick={handleDeleteAll}>
                        <Trash2 size={18} />
                        Delete All
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
                                    <th>Member Name</th>
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
                                    <th>IFSC Code</th>
                                    <th>Account Number</th>
                                    <th>Contact Person</th>
                                    <th>Contact No</th>
                                    <th style={{ position: 'sticky', right: 0, background: '#0F3642', zIndex: 21, boxShadow: '-2px 0 5px rgba(0,0,0,0.05)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan={17} className="text-center" style={{ padding: '40px' }}>
                                            No members found. Click "Create" to add one.
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((member: Member) => (
                                        <tr key={member.id}>
                                            <td>{formatMno(member.id)}</td>
                                            <td className="logo-cell">
                                                {member.logo ? (
                                                    <img src={member.logo} alt={member.name} />
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
                                            <td>{member.name}</td>
                                            <td>{member.gst_no || '-'}</td>
                                            <td>{member.pancard_no || '-'}</td>
                                            <td>{member.din_no || '-'}</td>
                                            <td>{member.website || '-'}</td>
                                            <td>{Array.isArray(member.hughes_no) && member.hughes_no.length > 0 ? member.hughes_no[0] : '-'}</td>
                                            <td>{member.mobile_number}</td>
                                            <td>{member.resi || '-'}</td>
                                            <td className="checkbox-cell">
                                                <input
                                                    type="checkbox"
                                                    checked={member.amd || false}
                                                    onChange={() => handleToggleAmd(member.id, member.amd)}
                                                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                />
                                            </td>
                                            <td>{member.email}</td>
                                            <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {member.address}
                                            </td>
                                            <td>{member.city || '-'}</td>
                                            <td>{member.bank || '-'}</td>
                                            <td>{member.ifsc_code || '-'}</td>
                                            <td>{member.account_number || '-'}</td>
                                            <td>{member.contact_person_name || '-'}</td>
                                            <td>{member.contact_no || '-'}</td>
                                            <td style={{ position: 'sticky', right: 0, background: 'white', zIndex: 10, boxShadow: '-2px 0 5px rgba(0,0,0,0.05)' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            className="action-btn"
                                                            onClick={() => navigate(`/members/${member.id}`)}
                                                            title="View"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            className="action-btn"
                                                            onClick={() => navigate(`/members/${member.id}/edit`)}
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            className="action-btn delete"
                                                            onClick={() => handleDelete(member.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    {/* Member Access Toggle - Now below buttons to prevent being hidden by column constraints */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F9FAFB', padding: '4px 6px', borderRadius: '6px', border: '1px solid #E5E7EB' }} title="Give this user access to the app's Member Directory">
                                                        <span style={{ fontSize: '11px', fontWeight: 500, color: '#4B5563' }}>App Access:</span>
                                                        <label style={{
                                                            position: 'relative',
                                                            display: 'inline-block',
                                                            width: 32,
                                                            height: 18,
                                                            cursor: 'pointer',
                                                        }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={!!member.user?.member_directory_access}
                                                                onChange={async (e) => {
                                                                    await toggleMemberAccess(member.id, member.user_id, e.target.checked);
                                                                }}
                                                                style={{ opacity: 0, width: 0, height: 0 }}
                                                            />
                                                            <span style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                backgroundColor: member.user?.member_directory_access ? '#22C55E' : '#D1D5DB',
                                                                borderRadius: 18,
                                                                transition: 'background-color 0.3s',
                                                            }}>
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    height: 12,
                                                                    width: 12,
                                                                    left: member.user?.member_directory_access ? 17 : 3,
                                                                    bottom: 3,
                                                                    backgroundColor: 'white',
                                                                    borderRadius: '50%',
                                                                    transition: 'left 0.3s',
                                                                }} />
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}
                {!isLoading && members.length > 0 && (
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
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
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

                            {/* Page Numbers */}
                            {(() => {
                                const pages = [];
                                const maxVisible = 5;
                                let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                                if (endPage - startPage + 1 < maxVisible) {
                                    startPage = Math.max(1, endPage - maxVisible + 1);
                                }

                                if (startPage > 1) {
                                    pages.push(
                                        <button key={1} className="pagination-btn" onClick={() => handlePageChange(1)}>1</button>
                                    );
                                    if (startPage > 2) {
                                        pages.push(<span key="start-ellipsis" style={{ color: '#6F767E' }}>...</span>);
                                    }
                                }

                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                        <button
                                            key={i}
                                            className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
                                            onClick={() => handlePageChange(i)}
                                        >
                                            {i}
                                        </button>
                                    );
                                }

                                if (endPage < totalPages) {
                                    if (endPage < totalPages - 1) {
                                        pages.push(<span key="end-ellipsis" style={{ color: '#6F767E' }}>...</span>);
                                    }
                                    pages.push(
                                        <button key={totalPages} className="pagination-btn" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                                    );
                                }

                                return pages;
                            })()}

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

                        <span className="pagination-info" style={{ color: '#6F767E', fontSize: '14px', marginLeft: '16px' }}>
                            {totalItems} Results • Page {currentPage} of {totalPages}
                        </span>
                    </div>
                )}
            </div>

            {showUploadModal && (
                <UploadExcelModal onClose={() => setShowUploadModal(false)} />
            )}
        </div>
    );
}

import { ChevronLeft, ChevronRight, Eye, Search, Trash2 } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../store/userStore';
import { useUserStore } from '../store/userStore';

export default function UserList() {
    const {
        users,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalItems,
        fetchUsers,
        deleteUser,
        toggleMemberAccess,
    } = useUserStore();

    const navigate = useNavigate();

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [sort, setSort] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchUsers(1, 10, sort, searchQuery);
    }, [fetchUsers, sort, searchQuery]);

    const handleDelete = async (id: number) => {
        const success = await deleteUser(id);
        if (success) {
            setDeleteConfirm(null);
            fetchUsers(currentPage, 10, sort, searchQuery);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchUsers(page, 10, sort, searchQuery);
        }
    };

    // Generate sliding window of page numbers
    const getPageNumbers = useCallback(() => {
        const maxVisible = 7;
        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];
        const half = Math.floor(maxVisible / 2);
        let start = Math.max(2, currentPage - half);
        let end = Math.min(totalPages - 1, currentPage + half);

        // Adjust window
        if (currentPage <= half + 1) {
            end = maxVisible - 1;
        }
        if (currentPage >= totalPages - half) {
            start = totalPages - maxVisible + 2;
        }

        pages.push(1);
        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);

        return pages;
    }, [currentPage, totalPages]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">User Details</h1>
                <div style={{ flex: 1 }}></div>
                <div style={{ position: 'relative', marginRight: 12 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by name, email, mobile..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{ paddingLeft: 36, width: 280 }}
                    />
                </div>
                <select
                    className="form-input"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{ width: 140 }}
                >
                    <option value="recent">Recently Added</option>
                    <option value="time">Sort by Time (Oldest)</option>
                </select>
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
                                    <th>ID</th>
                                    <th>PROFILE</th>
                                    <th>FULL NAME</th>
                                    <th>MOBILE NUMBER</th>
                                    <th>EMAIL</th>
                                    <th>PAN CARD</th>
                                    <th>MEMBER ACCESS</th>
                                    <th>CREATED AT</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} style={{ textAlign: 'center', padding: 40 }}>
                                            {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user: User) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>
                                                {user.profile_image ? (
                                                    <img
                                                        src={user.profile_image}
                                                        alt={user.fullname || 'User'}
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        background: '#E5E7EB',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        color: '#6B7280',
                                                    }}>
                                                        {(user.fullname || 'U')[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </td>
                                            <td>{user.fullname || '-'}</td>
                                            <td>{user.mobile_number}</td>
                                            <td>{user.email || '-'}</td>
                                            <td>{user.pancard_number || '-'}</td>
                                            <td>
                                                <label style={{
                                                    position: 'relative',
                                                    display: 'inline-block',
                                                    width: 44,
                                                    height: 24,
                                                    cursor: 'pointer',
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!user.member_directory_access}
                                                        onChange={async (e) => {
                                                            await toggleMemberAccess(user.id, e.target.checked);
                                                        }}
                                                        style={{ opacity: 0, width: 0, height: 0 }}
                                                    />
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: user.member_directory_access ? '#22C55E' : '#D1D5DB',
                                                        borderRadius: 24,
                                                        transition: 'background-color 0.3s',
                                                    }}>
                                                        <span style={{
                                                            position: 'absolute',
                                                            content: '""',
                                                            height: 18,
                                                            width: 18,
                                                            left: user.member_directory_access ? 22 : 3,
                                                            bottom: 3,
                                                            backgroundColor: 'white',
                                                            borderRadius: '50%',
                                                            transition: 'left 0.3s',
                                                        }} />
                                                    </span>
                                                </label>
                                            </td>
                                            <td>
                                                {user.created_at
                                                    ? new Date(user.created_at).toLocaleDateString()
                                                    : '-'}
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="action-btn view"
                                                        title="View"
                                                        onClick={() => navigate(`/users/${user.id}`)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        title="Delete"
                                                        onClick={() => setDeleteConfirm(user.id)}
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

                        {users.length > 0 && (
                            <div className="table-footer" style={{ position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #E5E9F2', padding: '16px 20px', zIndex: 20, display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {getPageNumbers().map((page, idx) =>
                                        page === '...' ? (
                                            <span key={`ellipsis-${idx}`} style={{ padding: '4px 8px', color: '#9CA3AF' }}>…</span>
                                        ) : (
                                            <button
                                                key={page}
                                                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                                                onClick={() => handlePageChange(page as number)}
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
                                <span className="results-count" style={{ alignSelf: 'center' }}>{totalItems} Results Found</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
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

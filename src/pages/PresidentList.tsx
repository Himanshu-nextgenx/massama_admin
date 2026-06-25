import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePresidentStore } from '../store/presidentStore';

// Sortable Row Component
function SortableRow({ president, onDeleteConfirm }: { president: any, onDeleteConfirm: (id: number) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: president.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? '#F9FAFB' : undefined,
        position: 'relative' as const,
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <tr ref={setNodeRef} style={style}>
            <td {...attributes} {...listeners} style={{ cursor: 'grab', width: 40 }}>
                <GripVertical size={20} color="#9CA3AF" />
            </td>
            <td>
                <div className="logo-cell">
                    {president.profile_image ? (
                        <img src={president.profile_image} alt={president.name} className="avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <div className="avatar-placeholder" style={{ width: 40, height: 40, borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500, color: '#6B7280' }}>
                            {(president.name || 'P')[0]}
                        </div>
                    )}
                </div>
            </td>
            <td><div style={{ fontWeight: 500 }}>{president.name}</div></td>
            <td>{president.designation}</td>
            <td>{president.years}</td>
            <td>
                <div className="table-actions">
                    <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => onDeleteConfirm(president.id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function PresidentList() {
    const { presidents, fetchPresidents, deletePresident, reorderPresidents, isLoading, error } = usePresidentStore();
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [localPresidents, setLocalPresidents] = useState<any[]>([]);

    useEffect(() => {
        fetchPresidents();
    }, [fetchPresidents]);

    useEffect(() => {
        setLocalPresidents(presidents);
    }, [presidents]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setLocalPresidents((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = [...items];
                const [movedItem] = newItems.splice(oldIndex, 1);
                newItems.splice(newIndex, 0, movedItem);

                // Call API to persist order
                reorderPresidents(newItems.map(item => item.id));

                return newItems;
            });
        }
    };

    const handleDelete = async (id: number) => {
        await deletePresident(id);
        setDeleteConfirm(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Presidents</h1>
                <Link to="/presidents/create" className="btn btn-primary">
                    <Plus size={20} />
                    Add President
                </Link>
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
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <table className="data-table">
                            <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                                <tr>
                                    <th style={{ width: 40 }}></th>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Designation</th>
                                    <th>Years</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <SortableContext
                                    items={localPresidents.map(p => p.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {localPresidents.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                                                <User size={48} color="#6F767E" style={{ marginBottom: 16, opacity: 0.5, margin: '0 auto' }} />
                                                <p>No presidents found.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        localPresidents.map((president) => (
                                            <SortableRow
                                                key={president.id}
                                                president={president}
                                                onDeleteConfirm={setDeleteConfirm}
                                            />
                                        ))
                                    )}
                                </SortableContext>
                            </tbody>
                        </table>
                    </DndContext>
                )}
            </div>

            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this president? This action cannot be undone.</p>
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

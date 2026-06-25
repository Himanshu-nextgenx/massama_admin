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
import { ExternalLink, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTechnicalDetailStore } from '../store/technicalDetailStore';

// Sortable Row Component
function SortableRow({ item, onDeleteConfirm }: { item: any, onDeleteConfirm: (id: number) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

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
            <td><div style={{ fontWeight: 500 }}>{item.label_name}</div></td>
            <td>
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#5C6BC0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {item.link.length > 50 ? item.link.substring(0, 50) + '...' : item.link}
                    <ExternalLink size={14} />
                </a>
            </td>
            <td>
                <div className="table-actions">
                    <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => onDeleteConfirm(item.id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function TechnicalDetailList() {
    const { technicalDetails, fetchTechnicalDetails, deleteTechnicalDetail, reorderTechnicalDetails, isLoading, error } = useTechnicalDetailStore();
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [localItems, setLocalItems] = useState<any[]>([]);

    useEffect(() => {
        fetchTechnicalDetails();
    }, [fetchTechnicalDetails]);

    useEffect(() => {
        setLocalItems(technicalDetails);
    }, [technicalDetails]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setLocalItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = [...items];
                const [movedItem] = newItems.splice(oldIndex, 1);
                newItems.splice(newIndex, 0, movedItem);

                reorderTechnicalDetails(newItems.map(item => item.id));

                return newItems;
            });
        }
    };

    const handleDelete = async (id: number) => {
        await deleteTechnicalDetail(id);
        setDeleteConfirm(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="page-header" style={{ flexShrink: 0 }}>
                <h1 className="page-title">Technical Details</h1>
                <Link to="/technical-details/create" className="btn btn-primary">
                    <Plus size={20} />
                    Add Technical Detail
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
                                    <th>Label Name</th>
                                    <th>Link</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <SortableContext
                                    items={localItems.map(p => p.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {localItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: 40 }}>
                                                <ExternalLink size={48} color="#6F767E" style={{ marginBottom: 16, opacity: 0.5, margin: '0 auto' }} />
                                                <p>No technical details found.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        localItems.map((item) => (
                                            <SortableRow
                                                key={item.id}
                                                item={item}
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
                            <p>Are you sure you want to delete this technical detail? This action cannot be undone.</p>
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

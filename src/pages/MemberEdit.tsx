import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MemberForm from '../components/company/MemberForm';
import { useMemberStore } from '../store/memberStore';

export default function MemberEdit() {
    const { id } = useParams<{ id: string }>();
    const { selectedMember, isLoading, fetchMemberById } = useMemberStore();

    useEffect(() => {
        if (id) {
            fetchMemberById(Number(id));
        }
    }, [id, fetchMemberById]);

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!selectedMember) {
        return <div>Member not found</div>;
    }

    return (
        <MemberForm
            initialData={{
                ...selectedMember,
                logo: undefined // Convert string logo to undefined for form (form handles File type)
            }}
            initialLogoUrl={selectedMember.logo}
            memberId={Number(id)}
            isEdit
        />
    );
}

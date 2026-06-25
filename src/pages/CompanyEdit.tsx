import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CompanyForm from '../components/company/CompanyForm';
import { useCompanyStore } from '../store/companyStore';

export default function CompanyEdit() {
    const { id } = useParams<{ id: string }>();
    const { selectedCompany, isLoading, fetchCompanyById } = useCompanyStore();

    useEffect(() => {
        if (id) {
            fetchCompanyById(Number(id));
        }
    }, [id, fetchCompanyById]);

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!selectedCompany) {
        return <div>Company not found</div>;
    }

    return (
        <CompanyForm
            initialData={{
                ...selectedCompany,
                logo: undefined // Convert string logo to undefined for form (form handles File type)
            }}
            companyId={Number(id)}
            isEdit
        />
    );
}

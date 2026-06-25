import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import './index.css';
import AccountDeletion from './pages/AccountDeletion';
import BannerList from './pages/BannerList';
import CommitteeMemberCreate from './pages/CommitteeMemberCreate';
import CommitteeMemberList from './pages/CommitteeMemberList';
import Dashboard from './pages/Dashboard';
import EssentialContactCreate from './pages/EssentialContactCreate';
import EssentialContactEdit from './pages/EssentialContactEdit';
import EssentialContactList from './pages/EssentialContactList';
import EventList from './pages/EventList';
import ExhibitionList from './pages/ExhibitionList';
import HughesCreate from './pages/HughesCreate';
import HughesList from './pages/HughesList';
import Login from './pages/Login';
import MemberCreate from './pages/MemberCreate';
import MemberDetail from './pages/MemberDetail';
import MemberEdit from './pages/MemberEdit';
import MemberList from './pages/MemberList';
import MemberOfferList from './pages/MemberOfferList';
import MemberProductList from './pages/MemberProductList';
import NewsList from './pages/NewsList';
import PresidentCreate from './pages/PresidentCreate';
import PresidentList from './pages/PresidentList';
import NonPayerCustomerList from './pages/NonPayerCustomerList';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProductList from './pages/ProductList';
import TechnicalDetailCreate from './pages/TechnicalDetailCreate';
import TechnicalDetailList from './pages/TechnicalDetailList';
import TermsAndConditions from './pages/TermsAndConditions';
import UserDetail from './pages/UserDetail';
import UserList from './pages/UserList';

// Auth check wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/account-deletion" element={<AccountDeletion />} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />

          {/* Users */}
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />

          {/* Members */}
          <Route path="members" element={<MemberList />} />
          <Route path="members/create" element={<MemberCreate />} />
          <Route path="members/:id" element={<MemberDetail />} />
          <Route path="members/:id/edit" element={<MemberEdit />} />

          {/* Products */}
          <Route path="products" element={<ProductList />} />

          {/* Member Products */}
          <Route path="member-products" element={<MemberProductList />} />

          {/* Events */}
          <Route path="events" element={<EventList />} />

          {/* Banners */}
          <Route path="banners" element={<BannerList />} />

          {/* Exhibitions */}
          <Route path="exhibitions" element={<ExhibitionList />} />

          {/* Member Offers */}
          {/* Member Offers */}
          <Route path="offers" element={<MemberOfferList />} />

          {/* Presidents */}
          <Route path="presidents" element={<PresidentList />} />
          <Route path="presidents/create" element={<PresidentCreate />} />

          {/* Non Payer Customers */}
          <Route path="non-payer-customers" element={<NonPayerCustomerList />} />

          {/* Committee Members */}
          <Route path="committee-members" element={<CommitteeMemberList />} />
          <Route path="committee-members/create" element={<CommitteeMemberCreate />} />

          {/* Technical Details */}
          <Route path="technical-details" element={<TechnicalDetailList />} />
          <Route path="technical-details/create" element={<TechnicalDetailCreate />} />

          {/* Hughes */}
          <Route path="hughes" element={<HughesList />} />
          <Route path="hughes/create" element={<HughesCreate />} />

          {/* Essential Contacts */}
          <Route path="essential-contacts" element={<EssentialContactList />} />
          <Route path="essential-contacts/create" element={<EssentialContactCreate />} />
          <Route path="essential-contacts/:id/edit" element={<EssentialContactEdit />} />

          {/* News */}
          <Route path="news" element={<NewsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

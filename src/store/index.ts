/**
 * Store Index
 * Re-exports all Zustand stores
 */

// Member Store
export { useMemberStore } from './memberStore';
export type { Member, MemberFormData } from './memberStore';

// User Store
export { useUserStore } from './userStore';
export type { User } from './userStore';

// Product Store
export { useProductStore } from './productStore';
export type {
    MasterProductName, MemberProduct as ProductMemberProduct,
    ProductSummary
} from './productStore';

// Event Store
export { useEventStore } from './eventStore';
export type { EventEntity, EventFormData } from './eventStore';

// Banner Store
export { useBannerStore } from './bannerStore';
export type { Banner } from './bannerStore';

// Member Product Store
export { useMemberProductStore } from './memberProductStore';
export type {
    MemberProduct, MemberProductCategory, MemberProductFilters, MemberProductFormData, MemberProductSubCategory, MemberProductType
} from './memberProductStore';

// Member Offer Store
export { useMemberOfferStore } from './memberOfferStore';
export type { MemberOfferEntity, MemberOfferFormData } from './memberOfferStore';


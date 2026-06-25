/**
 * TypeScript Types matching NestJS DTOs
 * Auto-generated from server/src DTOs
 */

// ===== MEMBER TYPES =====
export interface Member {
    id: number;
    name: string;
    gst_no?: string;
    pancard_no?: string;
    din_no?: string;
    website?: string;
    hughes_no?: string;
    mobile_number: string;
    resi?: string;
    amd?: boolean;
    email: string;
    address: string;
    city?: string;
    bank?: string;
    branch?: string;
    account_number?: string;
    logo?: string;
    user_id: number;
    user?: User;
    created_at?: string;
    updated_at?: string;
}

export interface CreateMemberDto {
    name: string;
    gst_no?: string;
    pancard_no?: string;
    din_no?: string;
    website?: string;
    hughes_no?: string;
    mobile_number: string;
    amd?: boolean;
    email: string;
    address: string;
    logo?: string;
    user_id: number;
}

export interface UpdateMemberDto extends Partial<CreateMemberDto> { }

export interface MemberFilterDto {
    page?: number;
    limit?: number;
    search?: string;
}

// Aliases for backward compatibility
export type Company = Member;
export type CreateCompanyDto = CreateMemberDto;
export type UpdateCompanyDto = UpdateMemberDto;
export type CompanyFilterDto = MemberFilterDto;

// ===== USER TYPES =====
export interface User {
    id: number;
    fullname?: string;
    email?: string;
    mobile_number: string;
    pancard_number?: string;
    profile_image?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UpdateUserDto {
    fullname?: string;
    email?: string;
    pancard_number?: string;
}

export interface UserFilterDto {
    page?: number;
    limit?: number;
    search?: string;
}

// ===== PRODUCT TYPES =====
export enum ProductName {
    TMT_BARS = 'TMT_BARS',
    MS_ANGLES = 'MS_ANGLES',
    MS_CHANNELS = 'MS_CHANNELS',
    MS_FLATS = 'MS_FLATS',
    MS_ROUNDS = 'MS_ROUNDS',
    STEEL_PLATES = 'STEEL_PLATES',
    STEEL_SHEETS = 'STEEL_SHEETS',
    HR_COILS = 'HR_COILS',
    CR_COILS = 'CR_COILS',
    GP_SHEETS = 'GP_SHEETS',
}

export enum ProductType {
    RAW_MATERIAL = 'RAW_MATERIAL',
    FINISHED_PRODUCT = 'FINISHED_PRODUCT',
    SEMI_FINISHED = 'SEMI_FINISHED',
    SCRAP = 'SCRAP',
    SECONDARY = 'SECONDARY',
}

export enum ProductCategory {
    LONG_PRODUCTS = 'LONG_PRODUCTS',
    FLAT_PRODUCTS = 'FLAT_PRODUCTS',
    STAINLESS_STEEL = 'STAINLESS_STEEL',
    ALLOY_STEEL = 'ALLOY_STEEL',
    CARBON_STEEL = 'CARBON_STEEL',
    GALVANIZED_STEEL = 'GALVANIZED_STEEL',
}

export enum ProductSubCategory {
    PRIME_QUALITY = 'PRIME_QUALITY',
    SECONDARY_QUALITY = 'SECONDARY_QUALITY',
    DEFECTIVE = 'DEFECTIVE',
    SURPLUS = 'SURPLUS',
    IMPORT = 'IMPORT',
    DOMESTIC = 'DOMESTIC',
}

export interface MemberProduct {
    id: number;
    product_name_id: number;
    product_name?: { id: number; name: string };
    product?: { id: number; name: string };
    member_id: number;
    member?: Member;
    created_at?: string;
    updated_at?: string;
}

export interface CreateMemberProductDto {
    product_name_id: number;
    member_id: number;
    type: ProductType;
    category: ProductCategory;
    sub_category: ProductSubCategory;
    grade: string;
    quantity: number;
    price: number;
}

export interface UpdateMemberProductDto extends Partial<CreateMemberProductDto> { }

export interface MemberProductFilterDto {
    page?: number;
    limit?: number;
    search?: string;
    category?: ProductCategory;
    type?: ProductType;
    member_id?: number;
}

// ===== EVENT TYPES =====
export interface EventEntity {
    id: number;
    name: string;
    date: string;
    time: string;
    description?: string;
    country: string;
    city: string;
    address: string;
    landmark?: string;
    image?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateEventDto {
    name: string;
    date: string;
    time: string;
    description?: string;
    country: string;
    city: string;
    address: string;
    landmark?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> { }

export interface EventFilterDto {
    page?: number;
    limit?: number;
    search?: string;
}

// ===== BANNER TYPES =====
export interface Banner {
    id: number;
    image_url: string;
    created_at?: string;
}

// ===== CATALOG PRODUCT TYPES =====
export interface Product {
    id: number;
    name: string;
    description?: string;
    images?: string[];
    price?: number;
    category?: string;
    stock?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price?: number;
    category?: string;
    stock?: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }

export interface ProductFilterDto {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}

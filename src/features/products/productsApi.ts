import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/app/store';

export interface ProductOwner {
    ulid: string;
    name: string;
}

export interface Product {
    ulid: string;
    name: string;
    price: number;
    status: 'active' | 'pending' | 'inactive';
    category: string,
    subcategory: string,
    item_condition: string,
    type_ad: string,
    city: string | null;
    views_count: number;
    created_at_formatted: string;
    image_path?: string | null;
    user?: ProductOwner; // Отношение с продавцом (with: ['user'])
}

interface PaginatedProductsResponse {
    status: string;
    message: string;
    data: {
        items: Product[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<PaginatedProductsResponse, { page: number; search: string }>({
            query: ({ page = 1, search = '' }) => `/products?page=${page}&search=${search}`,
        }),
    }),
});

export const { useGetProductsQuery } = productsApi;
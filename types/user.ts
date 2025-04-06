export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    isAdmin: boolean;
    lastActive: string;
    dateAdded: string;
    canExportData: boolean;
    canImportData: boolean;
}

export type SortField = 'name' | 'lastActive' | 'dateAdded';
export type SortOrder = 'asc' | 'desc'; 
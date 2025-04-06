'use client';

import AdminProtected from '@/components/AdminProtected';
import UserManagement from '@/components/UserManagement';

export default function UserManagementPage() {
    return (
        <AdminProtected>
            <UserManagement />
        </AdminProtected>
    );
} 
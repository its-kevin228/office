'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from './UserProfile';

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="border-b bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-end h-16">
                    <div className="flex items-center gap-6">
                        {user?.isAdmin && (
                            <Link
                                href="/user-management"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Gestion des utilisateurs
                            </Link>
                        )}
                        <UserProfile />
                    </div>
                </div>
            </div>
        </nav>
    );
} 
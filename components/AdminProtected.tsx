'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminProtected({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            router.push('/');
        }
    }, [user, router]);

    if (!user || !user.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Accès refusé</h1>
                    <p className="text-muted-foreground">
                        Vous devez être administrateur pour accéder à cette page.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 
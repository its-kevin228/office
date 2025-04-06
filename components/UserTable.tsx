'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, UserIcon, Shield, Archive, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserTableProps {
    users: User[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onDeleteUser: (userId: string) => void;
    onArchiveUser: (userId: string) => void;
    onUpdatePermissions: (userId: string) => void;
    onViewProfile: (userId: string) => void;
}

export default function UserTable({
    users,
    currentPage,
    totalPages,
    onPageChange,
    onDeleteUser,
    onArchiveUser,
    onUpdatePermissions,
    onViewProfile
}: UserTableProps) {
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [userToArchive, setUserToArchive] = useState<string | null>(null);

    const handleDelete = (userId: string) => {
        setUserToDelete(userId);
    };

    const handleArchive = (userId: string) => {
        setUserToArchive(userId);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete);
            setUserToDelete(null);
        }
    };

    const confirmArchive = () => {
        if (userToArchive) {
            onArchiveUser(userToArchive);
            setUserToArchive(null);
        }
    };

    return (
        <div className="w-full">
            <div className="table">
                <div className="table-header">
                    <div className="table-row">
                        <div className="table-head w-[50px]">#</div>
                        <div className="table-head">User</div>
                        <div className="table-head">Email</div>
                        <div className="table-head">Role</div>
                        <div className="table-head">Last Active</div>
                        <div className="table-head">Date Added</div>
                        <div className="table-head w-[100px]">Actions</div>
                    </div>
                </div>
                <div className="table-body">
                    {users.map((user, index) => (
                        <div key={user.id} className="table-row">
                            <div className="table-cell font-medium">{index + 1}</div>
                            <div className="table-cell">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/10"
                                    />
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            </div>
                            <div className="table-cell text-muted-foreground">{user.email}</div>
                            <div className="table-cell">
                                <div className="flex items-center gap-2">
                                    {user.isAdmin ? (
                                        <>
                                            <Shield className="h-4 w-4 text-primary" />
                                            <span className="text-primary font-medium">Admin</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">User</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="table-cell text-muted-foreground">{user.lastActive}</div>
                            <div className="table-cell text-muted-foreground">{user.dateAdded}</div>
                            <div className="table-cell">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="dropdown-content">
                                        <DropdownMenuItem onClick={() => onViewProfile(user.id)}>
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onUpdatePermissions(user.id)}>
                                            <Shield className="mr-2 h-4 w-4" />
                                            Permissions
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onArchiveUser(user.id)}>
                                            <Archive className="mr-2 h-4 w-4" />
                                            Archive
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDeleteUser(user.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                {currentPage > 1 ? (
                                    <PaginationPrevious
                                        onClick={() => onPageChange(currentPage - 1)}
                                        className="transition-all hover:bg-gray-100"
                                    />
                                ) : (
                                    <PaginationPrevious className="pointer-events-none opacity-50" />
                                )}
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page} className="hidden sm:inline-block">
                                    <PaginationLink
                                        onClick={() => onPageChange(page)}
                                        isActive={currentPage === page}
                                        className="transition-all hover:bg-gray-100"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                {currentPage < totalPages ? (
                                    <PaginationNext
                                        onClick={() => onPageChange(currentPage + 1)}
                                        className="transition-all hover:bg-gray-100"
                                    />
                                ) : (
                                    <PaginationNext className="pointer-events-none opacity-50" />
                                )}
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            {/* Dialogue de confirmation de suppression */}
            <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Toutes les données de l'utilisateur seront définitivement supprimées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialogue de confirmation d'archivage */}
            <AlertDialog open={!!userToArchive} onOpenChange={() => setUserToArchive(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archiver cet utilisateur ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            L'utilisateur n'aura plus accès à son compte mais ses données seront conservées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmArchive}>
                            Archiver
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 
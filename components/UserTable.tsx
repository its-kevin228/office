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
        <div className="transition-all duration-200 ease-in-out">
            <div className="w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                            <TableHead className="w-12 bg-gray-50/50">
                                <Checkbox className="transition-opacity hover:opacity-70" />
                            </TableHead>
                            <TableHead className="min-w-[200px] bg-gray-50/50 font-medium">User name</TableHead>
                            <TableHead className="min-w-[200px] bg-gray-50/50 font-medium">Access</TableHead>
                            <TableHead className="min-w-[120px] bg-gray-50/50 font-medium">Last active</TableHead>
                            <TableHead className="min-w-[120px] bg-gray-50/50 font-medium">Date added</TableHead>
                            <TableHead className="w-12 bg-gray-50/50"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center animate-fade-in">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <p>No users found.</p>
                                        <p className="text-sm">Try adjusting your search or filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="transition-colors hover:bg-gray-50/50 group"
                                >
                                    <TableCell className="transition-colors group-hover:bg-transparent">
                                        <Checkbox className="transition-opacity hover:opacity-70" />
                                    </TableCell>
                                    <TableCell className="transition-colors group-hover:bg-transparent">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="transition-transform hover:scale-105">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {user.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium transition-colors hover:text-primary cursor-pointer">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="transition-colors group-hover:bg-transparent">
                                        <div className="flex flex-wrap gap-2">
                                            {user.isAdmin && (
                                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 transition-all hover:bg-green-100">
                                                    Admin
                                                </span>
                                            )}
                                            {user.canExportData && (
                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 transition-all hover:bg-blue-100">
                                                    Data Export
                                                </span>
                                            )}
                                            {user.canImportData && (
                                                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20 transition-all hover:bg-purple-100">
                                                    Data Import
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground transition-colors group-hover:bg-transparent">
                                        {user.lastActive}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground transition-colors group-hover:bg-transparent">
                                        {user.dateAdded}
                                    </TableCell>
                                    <TableCell className="transition-colors group-hover:bg-transparent">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="transition-all hover:bg-gray-100 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={() => onViewProfile(user.id)}>
                                                    <UserIcon className="mr-2 h-4 w-4" />
                                                    <span>Voir le profil</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onUpdatePermissions(user.id)}>
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    <span>Permissions</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleArchive(user.id)}>
                                                    <Archive className="mr-2 h-4 w-4" />
                                                    <span>Archiver</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Supprimer</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
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
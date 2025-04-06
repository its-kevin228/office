'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronDown } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserTable from './UserTable';
import AddUserDialog from './AddUserDialog';
import ImageUpload from './ImageUpload';

const ITEMS_PER_PAGE = 8;
const STORAGE_KEY = 'user-management-data';

// Données initiales pour les nouveaux utilisateurs
const initialUsers: User[] = [
    {
        id: '1',
        name: 'Florence Shaw',
        email: 'florence@untitledui.com',
        password: 'admin123',
        avatar: '/avatars/florence.jpg',
        isAdmin: true,
        lastActive: 'Mar 4, 2024',
        dateAdded: 'July 4, 2022',
        canExportData: true,
        canImportData: true
    }
];

type SortOption = 'alphabetical' | 'dateAdded' | 'admin' | 'none';

export default function UserManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
    const [tempUserEdit, setTempUserEdit] = useState<Partial<User> | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('none');

    // Charger les données du localStorage au montage du composant
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setUsers(parsedData);
            } catch (error) {
                console.error('Error loading data from localStorage:', error);
                setUsers(initialUsers);
            }
        } else {
            setUsers(initialUsers);
        }
    }, []);

    // Sauvegarder les données dans le localStorage à chaque modification
    useEffect(() => {
        if (users.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        }
    }, [users]);

    const sortUsers = (users: User[]): User[] => {
        const sortedUsers = [...users];
        switch (sortOption) {
            case 'alphabetical':
                return sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
            case 'dateAdded':
                return sortedUsers.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
            case 'admin':
                return sortedUsers.sort((a, b) => {
                    if (a.isAdmin === b.isAdmin) return 0;
                    return a.isAdmin ? -1 : 1;
                });
            default:
                return sortedUsers;
        }
    };

    const filteredUsers = sortUsers(
        users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleAddUser = (newUser: Omit<User, 'id'>) => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const userWithId = {
            ...newUser,
            id: String(users.length + 1),
            lastActive: formattedDate,
            dateAdded: formattedDate
        };

        setUsers(prevUsers => [...prevUsers, userWithId]);
        setIsAddUserOpen(false);
    };

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleArchiveUser = (userId: string) => {
        // Pour l'instant, on supprime simplement l'utilisateur
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleUpdatePermissions = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsPermissionsOpen(true);
        }
    };

    const handleViewProfile = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setTempUserEdit(null);
            setIsProfileOpen(true);
        }
    };

    const handleUpdateProfile = (updatedInfo: Partial<User>) => {
        setTempUserEdit(prev => ({ ...prev, ...updatedInfo }));
    };

    const handleSaveProfile = () => {
        if (selectedUser && tempUserEdit) {
            const updatedUser = { ...selectedUser, ...tempUserEdit };
            setUsers(users.map(user =>
                user.id === selectedUser.id ? updatedUser : user
            ));
            setSelectedUser(updatedUser);
            setTempUserEdit(null);
            setIsProfileOpen(false);
        }
    };

    const handleImageUpload = (imageUrl: string) => {
        handleUpdateProfile({ avatar: imageUrl });
        setIsImageUploadOpen(false);
    };

    const handlePermissionsChange = (permissions: Partial<User>) => {
        if (selectedUser) {
            setUsers(users.map(user =>
                user.id === selectedUser.id
                    ? { ...user, ...permissions }
                    : user
            ));
            setIsPermissionsOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your team members and their account permissions here.
                        </p>
                    </div>

                    {/* Controls Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} total
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                                <div className="relative w-full sm:w-[250px]">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="flex-1 sm:flex-none whitespace-nowrap">
                                                <Filter className="mr-2 h-4 w-4" />
                                                {sortOption === 'none' ? 'Filters' :
                                                    sortOption === 'alphabetical' ? 'A-Z' :
                                                        sortOption === 'dateAdded' ? 'Recent first' :
                                                            'Admins first'}
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[200px]">
                                            <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                                                <DropdownMenuRadioItem value="none">No filter</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="alphabetical">Alphabetical (A-Z)</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="dateAdded">Date added (Recent first)</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="admin">Access level (Admins first)</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button
                                        className="flex-1 sm:flex-none whitespace-nowrap"
                                        onClick={() => setIsAddUserOpen(true)}
                                    >
                                        Add user
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <UserTable
                            users={paginatedUsers}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            onDeleteUser={handleDeleteUser}
                            onArchiveUser={handleArchiveUser}
                            onUpdatePermissions={handleUpdatePermissions}
                            onViewProfile={handleViewProfile}
                        />
                    </div>
                </div>
            </div>

            <AddUserDialog
                open={isAddUserOpen}
                onOpenChange={setIsAddUserOpen}
                onAddUser={handleAddUser}
            />

            {/* Profile Dialog */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>User Profile</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-6 py-4">
                            <div className="flex items-start gap-4">
                                <div className="relative group">
                                    <img
                                        src={tempUserEdit?.avatar || selectedUser.avatar}
                                        alt={selectedUser.name}
                                        className="h-20 w-20 rounded-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-white hover:text-white hover:bg-transparent"
                                            onClick={() => setIsImageUploadOpen(true)}
                                        >
                                            Change
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                            value={tempUserEdit?.name ?? selectedUser.name}
                                            onChange={(e) => handleUpdateProfile({ name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input
                                            type="email"
                                            value={tempUserEdit?.email ?? selectedUser.email}
                                            onChange={(e) => handleUpdateProfile({ email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Role</p>
                                        <p className="text-sm text-gray-500">{selectedUser.isAdmin ? 'Administrator' : 'User'}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsPermissionsOpen(true)}
                                    >
                                        Manage permissions
                                    </Button>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Last active</p>
                                    <p className="text-sm text-gray-500">{selectedUser.lastActive}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Member since</p>
                                    <p className="text-sm text-gray-500">{selectedUser.dateAdded}</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setTempUserEdit(null);
                                        setIsProfileOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={!tempUserEdit}
                                >
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Image Upload Dialog */}
            <Dialog open={isImageUploadOpen} onOpenChange={setIsImageUploadOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <ImageUpload
                            currentImage={selectedUser?.avatar}
                            onImageSelected={handleImageUpload}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Permissions Dialog */}
            <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>User Permissions</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isAdmin"
                                    checked={selectedUser.isAdmin}
                                    onCheckedChange={(checked) =>
                                        handlePermissionsChange({ isAdmin: !!checked })
                                    }
                                />
                                <label htmlFor="isAdmin">Administrator</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="canExportData"
                                    checked={selectedUser.canExportData}
                                    onCheckedChange={(checked) =>
                                        handlePermissionsChange({ canExportData: !!checked })
                                    }
                                />
                                <label htmlFor="canExportData">Can export data</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="canImportData"
                                    checked={selectedUser.canImportData}
                                    onCheckedChange={(checked) =>
                                        handlePermissionsChange({ canImportData: !!checked })
                                    }
                                />
                                <label htmlFor="canImportData">Can import data</label>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
} 
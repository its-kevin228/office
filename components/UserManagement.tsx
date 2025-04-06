'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Camera, Eye, EyeOff } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import UserTable from './UserTable';
import AddUserDialog from './AddUserDialog';
import ImageUpload from './ImageUpload';
import { Label } from "@/components/ui/label";

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

export default function UserManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
            setIsProfileOpen(true);
        }
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

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(users.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        ));
        setSelectedUser(updatedUser);
        setIsProfileOpen(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-heading font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage your team members and their account permissions here.</p>
                </div>

                <div className="card p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input pl-9 w-full sm:w-80"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => setIsAddUserOpen(true)} className="button-primary">
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="card overflow-hidden">
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

            <AddUserDialog
                open={isAddUserOpen}
                onOpenChange={setIsAddUserOpen}
                onAddUser={handleAddUser}
            />

            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="dialog-content">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-heading">User Profile</DialogTitle>
                        <DialogDescription>View and edit user information</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <img
                                        src={selectedUser.avatar}
                                        alt={selectedUser.name}
                                        className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                                        onClick={() => setIsImageUploadOpen(true)}
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={selectedUser.name}
                                        onChange={(e) => handleUpdateUser({ ...selectedUser, name: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={selectedUser.email}
                                        onChange={(e) => handleUpdateUser({ ...selectedUser, email: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={selectedUser.password}
                                            onChange={(e) => handleUpdateUser({ ...selectedUser, password: e.target.value })}
                                            className="input pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Permissions</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isAdmin"
                                            checked={selectedUser.isAdmin}
                                            onCheckedChange={(checked) =>
                                                handleUpdateUser({ ...selectedUser, isAdmin: checked as boolean })
                                            }
                                        />
                                        <Label htmlFor="isAdmin" className="font-medium">
                                            Administrator
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="canExportData"
                                            checked={selectedUser.canExportData}
                                            onCheckedChange={(checked) =>
                                                handleUpdateUser({ ...selectedUser, canExportData: checked as boolean })
                                            }
                                        />
                                        <Label htmlFor="canExportData" className="font-medium">
                                            Can export data
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="canImportData"
                                            checked={selectedUser.canImportData}
                                            onCheckedChange={(checked) =>
                                                handleUpdateUser({ ...selectedUser, canImportData: checked as boolean })
                                            }
                                        />
                                        <Label htmlFor="canImportData" className="font-medium">
                                            Can import data
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isImageUploadOpen} onOpenChange={setIsImageUploadOpen}>
                <DialogContent className="dialog-content">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-heading">Update Profile Picture</DialogTitle>
                        <DialogDescription>Upload a new profile picture for the user</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <ImageUpload
                            onImageSelected={(imageUrl: string) => {
                                handleUpdateUser({ ...selectedUser, avatar: imageUrl });
                                setIsImageUploadOpen(false);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
                <DialogContent className="dialog-content">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-heading">Manage Permissions</DialogTitle>
                        <DialogDescription>Update user permissions and access levels</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Access Level</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isAdmin"
                                            checked={selectedUser.isAdmin}
                                            onCheckedChange={(checked) =>
                                                handlePermissionsChange({ isAdmin: checked as boolean })
                                            }
                                        />
                                        <Label htmlFor="isAdmin" className="font-medium">
                                            Administrator
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="canExportData"
                                            checked={selectedUser.canExportData}
                                            onCheckedChange={(checked) =>
                                                handlePermissionsChange({ canExportData: checked as boolean })
                                            }
                                        />
                                        <Label htmlFor="canExportData" className="font-medium">
                                            Can export data
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="canImportData"
                                            checked={selectedUser.canImportData}
                                            onCheckedChange={(checked) =>
                                                handlePermissionsChange({ canImportData: checked as boolean })
                                            }
                                        />
                                        <Label htmlFor="canImportData" className="font-medium">
                                            Can import data
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPermissionsOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 
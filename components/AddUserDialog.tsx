'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import ImageUpload from './ImageUpload';
import { Eye, EyeOff } from 'lucide-react';

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddUser: (user: Omit<User, 'id'>) => void;
}

export default function AddUserDialog({
    open,
    onOpenChange,
    onAddUser,
}: AddUserDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: '',
        isAdmin: false,
        canExportData: false,
        canImportData: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date();
        onAddUser({
            ...formData,
            lastActive: now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
            dateAdded: now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
        });
        setFormData({
            name: '',
            email: '',
            password: '',
            avatar: '',
            isAdmin: false,
            canExportData: false,
            canImportData: false,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="dialog-content">
                <DialogHeader>
                    <DialogTitle className="text-xl font-heading">Add New User</DialogTitle>
                    <DialogDescription>Create a new user account with custom permissions</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <ImageUpload
                            onImageSelected={(imageUrl: string) => {
                                setFormData({ ...formData, avatar: imageUrl });
                            }}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input"
                                placeholder="Enter user's full name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input"
                                placeholder="Enter user's email address"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input pr-10"
                                    placeholder="Enter a secure password"
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

                        <div className="space-y-2">
                            <Label>Permissions</Label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isAdmin"
                                        checked={formData.isAdmin}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, isAdmin: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor="isAdmin" className="font-medium">
                                        Administrator
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="canExportData"
                                        checked={formData.canExportData}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, canExportData: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor="canExportData" className="font-medium">
                                        Can export data
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="canImportData"
                                        checked={formData.canImportData}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, canImportData: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor="canImportData" className="font-medium">
                                        Can import data
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.email || !formData.password}
                        className="button-primary"
                    >
                        Add User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 
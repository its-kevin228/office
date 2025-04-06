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
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add new user</DialogTitle>
                        <DialogDescription>
                            Add a new user to your team and set their permissions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <ImageUpload
                            onImageSelected={(url: string) => setFormData({ ...formData, avatar: url })}
                            currentImage={formData.avatar}
                        />
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required
                                    className="pr-24"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="admin"
                                    checked={formData.isAdmin}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isAdmin: checked as boolean })
                                    }
                                />
                                <Label htmlFor="admin">Administrator</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="export"
                                    checked={formData.canExportData}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, canExportData: checked as boolean })
                                    }
                                />
                                <Label htmlFor="export">Can export data</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="import"
                                    checked={formData.canImportData}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, canImportData: checked as boolean })
                                    }
                                />
                                <Label htmlFor="import">Can import data</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add user</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

export interface ImageUploadProps {
    onImageSelected: (imageUrl: string) => void;
    currentImage?: string;
}

export default function ImageUpload({ onImageSelected, currentImage }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setPreview(imageUrl);
                onImageSelected(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxFiles: 1
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                        <p className="text-sm text-muted-foreground">
                            Click or drag to change image
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-sm font-medium">Click or drag image to upload</p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG or GIF (max. 800x400px)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 
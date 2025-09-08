import React from 'react';
import { Link } from '@inertiajs/react';

interface EmptyStateCardProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    icon: React.ReactNode;
}

export default function EmptyStateCard({ 
    title, 
    description, 
    buttonText, 
    buttonLink, 
    icon 
}: Readonly<EmptyStateCardProps>) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="mb-6 text-gray-400">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {title}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md">
                {description}
            </p>
            <Link 
                href={buttonLink}
                className="px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors"
            >
                {buttonText}
            </Link>
        </div>
    );
}

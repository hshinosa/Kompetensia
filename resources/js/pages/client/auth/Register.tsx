import React from 'react';
import { Head } from '@inertiajs/react';
import RegisterForm from '@/components/client/auth/RegisterForm';

export default function Register() {
    return (
        <>
            <Head title="Daftar" />
            <RegisterForm />
        </>
    );
}

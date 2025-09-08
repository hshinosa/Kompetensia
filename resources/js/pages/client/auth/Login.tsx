import React from 'react';
import { Head } from '@inertiajs/react';
import LoginForm from '@/components/client/auth/LoginForm';

export default function Login() {
    return (
        <>
            <Head title="Masuk" />
            <LoginForm />
        </>
    );
}

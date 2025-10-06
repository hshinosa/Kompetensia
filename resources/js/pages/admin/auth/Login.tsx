import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    readonly status?: string;
}

export default function Login({ status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Admin Login" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-3xl border-4 border-purple-600 shadow-xl overflow-hidden">
                    {/* Form Section */}
                    <div className="p-8 lg:p-12">
                        <div className="w-full max-w-sm mx-auto">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-black mb-2">Admin Login</h1>
                                <p className="text-gray-600 text-sm">Enter your credentials to access the admin dashboard</p>
                            </div>

                            {status && (
                                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-center text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-base font-medium text-black mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admin@example.com"
                                        autoFocus
                                        autoComplete="email"
                                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-600 text-base ${
                                            errors.email ? 'border-red-400' : ''
                                        }`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-base font-medium text-black mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-600 text-base pr-12 ${
                                                errors.password ? 'border-red-400' : ''
                                            }`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                {showPassword ? (
                                                    <>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </>
                                                )}
                                            </svg>
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-base text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 px-4 rounded-lg bg-purple-600 text-white font-semibold text-base hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    {processing && (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {processing ? 'Logging in...' : 'Login to Admin Dashboard'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

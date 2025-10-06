import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    readonly user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    // Determine logout route based on user role
    const getLogoutRoute = () => {
        if (user.role === 'admin') {
            return route('admin.logout');
        } else if (user.role === 'mahasiswa') {
            return route('client.logout');
        }
        return route('logout');
    };

    // Determine settings route based on user role
    const getSettingsRoute = () => {
        if (user.role === 'admin' || user.role === 'mahasiswa') {
            return route('settings.profile.edit');
        }
        return route('settings.profile.edit');
    };

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        cleanup();
        
        // Get CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        try {
            // Use fetch to call logout endpoint
            const response = await fetch(getLogoutRoute(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                // Force full page reload to login page
                window.location.href = data.redirect;
            } else {
                // If error, still redirect to login page
                const loginUrl = user.role === 'admin' ? '/admin/login' : '/client/login';
                window.location.href = loginUrl;
            }
        } catch (error) {
            // On any error, force redirect to login
            const loginUrl = user.role === 'admin' ? '/admin/login' : '/client/login';
            window.location.href = loginUrl;
        }
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={getSettingsRoute()} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <button className="flex w-full items-center" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Log out
                </button>
            </DropdownMenuItem>
        </>
    );
}

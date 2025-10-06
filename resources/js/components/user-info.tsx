import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();
    
    // Handle both old and new field names for backward compatibility
    const userName = (user as any)?.nama || user?.name || '';
    const userEmail = user?.email || '';
    const userAvatar = (user as any)?.foto_profil || user?.avatar;

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black">
                    {getInitials(userName)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{userEmail}</span>}
            </div>
        </>
    );
}

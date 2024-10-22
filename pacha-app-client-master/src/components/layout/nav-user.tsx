import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/store';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuShortcut } from '../ui/dropdown-menu';
import { logout } from '@/services/auth';
import { useNavigate } from 'react-router-dom';

export function UserNav({}) {
  const navigate = useNavigate();
  const { user, logout: removeTokens } = useAuthStore();
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.shiftKey && event.ctrlKey) {
        switch (event.key.toUpperCase()) {
          case 'Q':
            logoutEvent();
            break;
          case 'P':
            // navigate({ to: '/profile' });
            break;
          case 'S':
            // navigate({ to: '/settings' });
            break;
          case 'C':
            // navigate({ to: '/subscribers' });
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const logoutEvent = async () => {
    try {
      await logout();
      removeTokens();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={'https://github.com/shadcn.png'}
              alt="@username"
            />
            <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logoutEvent}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

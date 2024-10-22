import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { NavLinkType } from '@/common/types';
import { useLocation, Link } from 'react-router-dom';

interface NavProps {
  isCollapsed: boolean;
  links: NavLinkType[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const fullPath = `/dashboard${link.path}`;
          const isActive = path === fullPath;

          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={fullPath || '#'}
                  className={cn(
                    buttonVariants({
                      variant: isActive ? 'default' : 'ghost',
                      size: 'icon',
                    }),
                    'h-9 w-9',
                    {
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white':
                        isActive,
                    }
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="text-muted-foreground ml-auto">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              to={fullPath || '#'}
              className={cn(
                buttonVariants({
                  variant: isActive ? 'default' : 'ghost',
                  size: 'sm',
                }),
                {
                  default: isActive,
                  ghost: !isActive,
                  'dark:bg-muted dark:hover:bg-muted dark:text-white dark:hover:text-white':
                    isActive,
                },
                'justify-start'
              )}
            >
              <link.icon className="h-4 w-4 sm:mr-2" />
              <div className="hidden sm:block">
                {link.title}
                {link.label && (
                  <span
                    className={cn('ml-auto', {
                      default: isActive,
                      'ghost text-background dark:text-white': !isActive,
                    })}
                  >
                    {link.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

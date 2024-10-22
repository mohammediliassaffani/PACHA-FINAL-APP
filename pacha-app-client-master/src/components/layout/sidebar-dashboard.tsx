import React from 'react';
import { cn } from '@/lib/utils';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';

import { Nav } from './navigation';

import ThemeSwitcher from '../ui/theme-toggle';
import { navPageConfig } from '@/common/nav';
import { UserNav } from './nav-user';

type Props = {
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
};

function Sidebar({
  children,
  defaultLayout = [265, 655 + 440],
  defaultCollapsed = false,
}: Props) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <TooltipProvider>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          localStorage.setItem(
            'react-resizable-panels:layout',
            JSON.stringify(sizes)
          );
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={4}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            localStorage.setItem(
              'react-resizable-panels:collapsed',
              JSON.stringify(true)
            );
          }}
          onExpand={() => {
            setIsCollapsed(false);
            localStorage.setItem(
              'react-resizable-panels:collapsed',
              JSON.stringify(false)
            );
          }}
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out'
          )}
        >
          <div
            className={cn(
              'flex h-[52px] items-center gap-2  ',
              isCollapsed ? 'h-[52px] justify-center' : 'jc px-2'
            )}
          >
            <p
              className={cn(
                'text-primary text-2xl font-bold dark:text-white',
                isCollapsed ? 'hidden' : 'block'
              )}
            >
              Bacha App
            </p>
            <p
              className={cn(
                'text-primary text-2xl font-bold dark:text-white',
                !isCollapsed ? 'hidden' : 'block'
              )}
            >
              BA
            </p>
          </div>
          <Separator />
          <ScrollArea className="h-full overflow-hidden">
            <Nav isCollapsed={isCollapsed} links={navPageConfig} />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="px-4 flex h-[52px] items-center justify-between ">
            <h1 className="text-sm font-bold lg:text-xl ">Admin Dashboard</h1>
            <div className="flex items-center justify-center gap-2">
              <ThemeSwitcher />

              {/* <Notification notifications={notifications} /> */}
              <UserNav />
            </div>
          </div>
          <Separator />
          <ScrollArea className=" " style={{ height: 'calc(100vh - 53px)' }}>
            <div className="my-4">{children}</div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

export default Sidebar;

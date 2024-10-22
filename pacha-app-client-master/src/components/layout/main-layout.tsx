import { useEffect, useState } from 'react';
import Sidebar from './sidebar-dashboard';
import { RotateCw } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  const [defaultLayout, setDefaultLayout] = useState<number[] | undefined>();
  const [defaultCollapsed, setDefaultCollapsed] = useState<
    boolean | undefined
  >();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const defaultSetting = () => {
      const layout = localStorage.getItem('react-resizable-panels:layout');
      const collapsed = localStorage.getItem(
        'react-resizable-panels:collapsed'
      );

      // Type assertions to ensure TypeScript knows the expected types
      setDefaultLayout(layout ? (JSON.parse(layout) as number[]) : undefined);
      setDefaultCollapsed(
        collapsed ? (JSON.parse(collapsed) as boolean) : undefined
      );
      setLoading(false); // Set loading to false after settings are fetched
    };

    defaultSetting();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <RotateCw className="animate-spin text-xl" />
      </div>
    );
  }

  return (
    <Sidebar
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
    >
      <Outlet />
    </Sidebar>
  );
}

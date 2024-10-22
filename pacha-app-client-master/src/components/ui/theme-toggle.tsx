import { Laptop, MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks';

// Define the functional component 'ThemeSwitcher'
const ThemeSwitcher = () => {
  // Access current theme and theme-changing function from 'next-themes'
  const { theme, setTheme } = useTheme();

  // Manage the mounting state of the component
  const [mounted, setMounted] = useState<boolean>(false);

  // Set 'mounted' to true once the component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // If the component is not yet mounted, return null to avoid rendering prematurely
  if (!mounted) return null;

  // Render the theme switcher component
  return (
    <Tabs defaultValue={theme}>
      <TabsList>
        {/* Light Theme Tab */}
        <TabsTrigger
          value="light"
          className="border"
          onClick={() => setTheme('light')}
        >
          <SunIcon className="h-5 w-5" />
        </TabsTrigger>

        {/* Dark Theme Tab */}
        <TabsTrigger
          value="dark"
          className="border"
          onClick={() => setTheme('dark')}
        >
          <MoonIcon className="h-5 w-5" />
        </TabsTrigger>

        {/* System Theme Tab */}
        <TabsTrigger
          value="system"
          className="border"
          onClick={() => setTheme('system')}
        >
          <Laptop className="h-5 w-5" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

// Export the 'ThemeSwitcher' component as the default export
export default ThemeSwitcher;

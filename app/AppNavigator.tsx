import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AppNavigator() {
  const router = useRouter();

  useEffect(() => {
    // Expose the navigation function to the global window object
    (window as any).navigateTo = (path: string) => {
      router.replace(path as any);
    };
  }, [router]);

  return null; // This component does not render anything
}
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Redirect href="/(user)/home" /> : <Redirect href="/(auth)/splash" />;
}

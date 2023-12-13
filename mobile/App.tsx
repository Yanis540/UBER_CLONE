import {SplashScreenAnimationLayout} from './src/layout/';
import Navigator from './src/routes/main';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ToastProvider } from 'react-native-toast-notifications'
import { useLocation } from './src/hooks';
import { MenuProvider } from 'react-native-popup-menu';
import Stripe from './src/context/Stripe';
import * as Notifications from 'expo-notifications';
import { useListenNotifications } from './src/hooks/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const queryClient = new QueryClient(); 
  const {localisation} = useLocation()
  useListenNotifications(); 
  return (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <MenuProvider>
        <SplashScreenAnimationLayout>
          <Stripe>
            <Navigator /> 
          </Stripe>
        </SplashScreenAnimationLayout>
      </MenuProvider>
    </ToastProvider>
  </QueryClientProvider>
  );
}
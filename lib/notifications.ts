import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, LogBox } from 'react-native';
import { updatePushToken, deletePushToken } from './api/customers';
import { savePushToken, deletePushToken as deleteStoredPushToken } from './secureStore';
import { router } from 'expo-router';

LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);

let Notifications: typeof import('expo-notifications') | null = null;
const _consoleError = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('expo-notifications')) return;
  _consoleError(...args);
};
try {
  Notifications = require('expo-notifications');
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (_e) {
  // not available in Expo Go
} finally {
  console.error = _consoleError;
}

export async function registerForPushNotifications(customerId: string): Promise<void> {
  if (!Notifications || !Device.isDevice) return;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#041635',
      });
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;
    if (!projectId) return;
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    await updatePushToken(customerId, token.data);
    await savePushToken(token.data);
  } catch (_e) {}
}

export async function unregisterPushNotifications(customerId: string): Promise<void> {
  if (!Notifications) return;
  try {
    await deletePushToken(customerId);
    await deleteStoredPushToken();
  } catch (_e) {}
}

export function setupNotificationResponseListener(): () => void {
  if (!Notifications || !Device.isDevice) return () => {};

  try {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      const bookingId = data?.bookingId as string | undefined;
      if (bookingId) {
        router.push(`/(app)/bookings/${bookingId}`);
      }
    });
    return () => subscription.remove();
  } catch (_e) {
    return () => {};
  }
}

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { updatePushToken, deletePushToken } from './api/customers';
import { savePushToken, deletePushToken as deleteStoredPushToken } from './secureStore';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(customerId: string): Promise<void> {
  if (!Device.isDevice) return;

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
      lightColor: '#1B2B4B',
    });
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    await updatePushToken(customerId, token.data);
    await savePushToken(token.data);
  } catch {
    // Push token registration is best-effort
  }
}

export async function unregisterPushNotifications(customerId: string): Promise<void> {
  try {
    await deletePushToken(customerId);
    await deleteStoredPushToken();
  } catch {
    // Best-effort cleanup
  }
}

export function setupNotificationResponseListener(): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as Record<string, unknown>;
    const bookingId = data?.bookingId as string | undefined;
    if (bookingId) {
      router.push(`/(app)/bookings/${bookingId}`);
    }
  });

  return () => subscription.remove();
}

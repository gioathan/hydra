import * as SecureStore from 'expo-secure-store';

const KEYS = {
  token: 'hydra_token',
  user: 'hydra_user',
  customerId: 'hydra_customer_id',
  pushToken: 'hydra_push_token',
  pendingUserId: 'hydra_pending_user_id',
} as const;

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(KEYS.token, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.token);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(KEYS.token);
}

export async function saveUser(user: object) {
  await SecureStore.setItemAsync(KEYS.user, JSON.stringify(user));
}

export async function getUser<T>(): Promise<T | null> {
  const raw = await SecureStore.getItemAsync(KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function deleteUser() {
  await SecureStore.deleteItemAsync(KEYS.user);
}

export async function saveCustomerId(id: string) {
  await SecureStore.setItemAsync(KEYS.customerId, id);
}

export async function getCustomerId(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.customerId);
}

export async function deleteCustomerId() {
  await SecureStore.deleteItemAsync(KEYS.customerId);
}

export async function savePushToken(token: string) {
  await SecureStore.setItemAsync(KEYS.pushToken, token);
}

export async function getPushToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.pushToken);
}

export async function deletePushToken() {
  await SecureStore.deleteItemAsync(KEYS.pushToken);
}

export async function clearAll() {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.token),
    SecureStore.deleteItemAsync(KEYS.user),
    SecureStore.deleteItemAsync(KEYS.customerId),
    SecureStore.deleteItemAsync(KEYS.pushToken),
    SecureStore.deleteItemAsync(KEYS.pendingUserId),
  ]);
}

export async function savePendingUserId(id: string) {
  await SecureStore.setItemAsync(KEYS.pendingUserId, id);
}

export async function getPendingUserId(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.pendingUserId);
}

export async function clearPendingUserId() {
  await SecureStore.deleteItemAsync(KEYS.pendingUserId);
}

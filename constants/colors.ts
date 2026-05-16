export const Colors = {
  // Design system
  primary: '#041635',
  onPrimary: '#ffffff',
  primaryContainer: '#1b2b4b',
  onPrimaryContainer: '#8393b8',
  inversePrimary: '#b7c6ee',

  secondary: '#9c440f',
  onSecondary: '#ffffff',
  secondaryContainer: '#fd8e55',
  onSecondaryContainer: '#6e2a00',

  tertiary: '#0c191f',
  onTertiary: '#ffffff',
  tertiaryContainer: '#212d34',
  onTertiaryContainer: '#88959e',

  surface: '#fbf8fc',
  surfaceDim: '#dbd9dc',
  surfaceBright: '#fbf8fc',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5f3f6',
  surfaceContainer: '#efedf0',
  surfaceContainerHigh: '#e9e7eb',
  surfaceContainerHighest: '#e4e2e5',
  surfaceVariant: '#e4e2e5',

  onSurface: '#1b1b1e',
  onSurfaceVariant: '#44474e',
  inverseSurface: '#303033',
  inverseOnSurface: '#f2f0f3',

  outline: '#75777f',
  outlineVariant: '#c5c6cf',
  surfaceTint: '#4f5e81',

  background: '#fbf8fc',
  onBackground: '#1b1b1e',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  primaryFixed: '#d8e2ff',
  primaryFixedDim: '#b7c6ee',
  onPrimaryFixed: '#091b3a',
  onPrimaryFixedVariant: '#374668',

  secondaryFixed: '#ffdbcc',
  secondaryFixedDim: '#ffb693',
  onSecondaryFixed: '#351000',
  onSecondaryFixedVariant: '#7a3000',

  tertiaryFixed: '#d7e4ee',
  tertiaryFixedDim: '#bbc8d2',
  onTertiaryFixed: '#111d24',
  onTertiaryFixedVariant: '#3c4850',

  // Legacy aliases (keeps unrewritten components working)
  navy: '#041635',
  navyLight: '#1b2b4b',
  navyDark: '#020f26',
  terracotta: '#9c440f',
  terracottaLight: '#fd8e55',
  terracottaDark: '#7a3000',
  card: '#ffffff',
  border: '#c5c6cf',
  borderLight: '#e9e7eb',
  textPrimary: '#1b1b1e',
  textSecondary: '#44474e',
  textMuted: '#75777f',
  textInverse: '#ffffff',
  errorBg: '#ffdad6',
  overlayLight: 'rgba(4, 22, 53, 0.08)',
  overlay: 'rgba(4, 22, 53, 0.5)',

  // Generic semantic aliases
  success: '#15803D',
  successBg: '#DCFCE7',

  // Status
  statusPending: '#B45309',
  statusPendingBg: '#FEF3C7',
  statusConfirmed: '#15803D',
  statusConfirmedBg: '#DCFCE7',
  statusCancelled: '#6B7280',
  statusCancelledBg: '#F3F4F6',
  statusDeclined: '#DC2626',
  statusDeclinedBg: '#FEE2E2',
} as const;

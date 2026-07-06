export const Colors = {
  // Design system — Aegean (Mediterranean / island)
  primary: '#0C5F7D',            // deep Aegean sea
  onPrimary: '#ffffff',
  primaryContainer: '#0E4C63',   // deeper sea fill
  onPrimaryContainer: '#A9D6E3', // light sea on dark fill
  inversePrimary: '#8FD0E2',

  secondary: '#C25B3C',          // sun-baked terracotta
  onSecondary: '#ffffff',
  secondaryContainer: '#E88E6B', // lighter clay
  onSecondaryContainer: '#5A2410',

  tertiary: '#869A5B',           // olive grove
  onTertiary: '#ffffff',
  tertiaryContainer: '#DCE4C6',
  onTertiaryContainer: '#3A4622',

  // New brand accents
  sun: '#E8A83C',                // summer gold — stars, small joyful accents
  onSun: '#5A3D08',
  sea: '#2A9CC0',                // Cycladic dome blue — bright highlight
  bougainvillea: '#D45B7A',      // optional pop — featured / events

  surface: '#FAF6EF',            // limewash cream
  surfaceDim: '#E7DCCB',
  surfaceBright: '#FEFBF5',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#F4EDE1', // warm sand
  surfaceContainer: '#EFE7DA',
  surfaceContainerHigh: '#ECE3D4',
  surfaceContainerHighest: '#E6DCCC',
  surfaceVariant: '#E6DCCC',

  onSurface: '#22303A',          // slate ink
  onSurfaceVariant: '#566572',
  inverseSurface: '#2C3A42',
  inverseOnSurface: '#F1ECE2',

  outline: '#8B95A0',            // sea mist — muted text / outline
  outlineVariant: '#E1D7C6',     // stone — hairlines, borders
  surfaceTint: '#0C5F7D',

  background: '#FAF6EF',
  onBackground: '#22303A',

  error: '#C0392C',
  onError: '#ffffff',
  errorContainer: '#F7DED9',
  onErrorContainer: '#7A241B',

  primaryFixed: '#CDEAF2',
  primaryFixedDim: '#8FD0E2',
  onPrimaryFixed: '#04333F',
  onPrimaryFixedVariant: '#0A4356',

  secondaryFixed: '#F6D9CD',
  secondaryFixedDim: '#EDB49B',
  onSecondaryFixed: '#3A1608',
  onSecondaryFixedVariant: '#9E4527',

  tertiaryFixed: '#DCE4C6',
  tertiaryFixedDim: '#BFCB9E',
  onTertiaryFixed: '#26301A',
  onTertiaryFixedVariant: '#54613A',

  // Legacy aliases (keeps unrewritten components working) — remapped to Aegean
  navy: '#0C5F7D',
  navyLight: '#0E6E8E',
  navyDark: '#073D50',
  terracotta: '#C25B3C',
  terracottaLight: '#E88E6B',
  terracottaDark: '#9E4527',
  card: '#ffffff',
  border: '#E1D7C6',
  borderLight: '#ECE3D4',
  textPrimary: '#22303A',
  textSecondary: '#566572',
  textMuted: '#8B95A0',
  textInverse: '#ffffff',
  errorBg: '#F7DED9',
  overlayLight: 'rgba(12, 54, 72, 0.08)',
  overlay: 'rgba(12, 54, 72, 0.5)',

  // Generic semantic aliases
  success: '#4E8A5B',
  successBg: '#E4F0E2',

  // Status
  statusPending: '#C77E2E',
  statusPendingBg: '#FBEED6',
  statusConfirmed: '#4E8A5B',
  statusConfirmedBg: '#E4F0E2',
  statusCancelled: '#7C7669',
  statusCancelledBg: '#EFEAE0',
  statusDeclined: '#C6453D',
  statusDeclinedBg: '#F7DED9',
} as const;

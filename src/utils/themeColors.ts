/**
 * Theme-aware color utilities
 * Returns appropriate colors based on current theme (dark/light)
 */

export const themeColors = {
  // Primary accent colors
  primary: {
    dark: '#d4af37', // Gold
    light: '#0d9488', // Teal dark
  },
  primaryLight: {
    dark: '#f0d060', // Gold light
    light: '#14b8a6', // Teal
  },
  
  // Text colors
  textPrimary: {
    dark: '#ffffff',
    light: '#134e4a',
  },
  textSecondary: {
    dark: '#9ca3af', // gray-400
    light: '#0f766e', // teal-700
  },
  textMuted: {
    dark: '#6b7280', // gray-500
    light: '#0f766e80', // teal-700 with opacity
  },
  
  // Background colors
  card: {
    dark: '#1a1a2e',
    light: '#ffffff',
  },
  cardGradient: {
    dark: 'from-[#1a1a2e] to-[#16213e]',
    light: 'from-white to-[#f0fdfa]',
  },
  
  // Border colors
  border: {
    dark: 'border-[#d4af37]/10',
    light: 'border-[#14b8a6]/15',
  },
  borderStrong: {
    dark: 'border-[#d4af37]/30',
    light: 'border-[#14b8a6]/30',
  },
  
  // Background subtle
  bgSubtle: {
    dark: 'bg-[#0d0d1a]',
    light: 'bg-[#f0fdfa]',
  },
  bgInput: {
    dark: 'bg-[#0d0d1a] border-gray-700 text-white',
    light: 'bg-gray-50 border-gray-300 text-gray-900',
  },
  
  // Hover states
  hoverBg: {
    dark: 'hover:bg-white/5',
    light: 'hover:bg-[#f0fdfa]',
  },
  
  // Success/Error/Warning
  success: {
    dark: '#22c55e',
    light: '#059669',
  },
  successBg: {
    dark: 'bg-[#22c55e]/10',
    light: 'bg-[#10b981]/10',
  },
  
  // Accent blue (for tags, badges)
  accent: {
    dark: '#4a90d9',
    light: '#0d9488',
  },
  accentBg: {
    dark: 'bg-[#4a90d9]/20 text-[#6bb5ff]',
    light: 'bg-[#14b8a6]/15 text-[#0d9488]',
  },
};

/**
 * Get theme-aware class names
 */
export function getThemeClasses(isDark: boolean) {
  return {
    // Text
    textPrimary: isDark ? 'text-white' : 'text-[#134e4a]',
    textSecondary: isDark ? 'text-gray-400' : 'text-[#0f766e]/70',
    textMuted: isDark ? 'text-gray-500' : 'text-[#0f766e]/50',
    textAccent: isDark ? 'text-[#d4af37]' : 'text-[#0d9488]',
    
    // Backgrounds
    card: isDark 
      ? 'bg-[#1a1a2e] border-[#d4af37]/10' 
      : 'bg-white border-[#14b8a6]/15',
    cardGradient: isDark 
      ? 'bg-gradient-to-b from-[#1a1a2e] to-[#16213e]' 
      : 'bg-gradient-to-b from-white to-[#f0fdfa]',
    cardHorizontal: isDark
      ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e]'
      : 'bg-gradient-to-l from-white to-[#f0fdfa]',
    
    // Inputs
    input: isDark 
      ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' 
      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#14b8a6]',
    
    // Buttons
    buttonPrimary: isDark
      ? 'bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a]'
      : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white',
    buttonSecondary: isDark
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    
    // Borders
    border: isDark ? 'border-[#d4af37]/10' : 'border-[#14b8a6]/15',
    borderStrong: isDark ? 'border-[#d4af37]/30' : 'border-[#14b8a6]/30',
    
    // Badges
    badge: isDark
      ? 'bg-[#4a90d9]/20 text-[#6bb5ff]'
      : 'bg-[#14b8a6]/15 text-[#0d9488]',
    
    // Success
    success: isDark
      ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20'
      : 'bg-[#10b981]/10 text-[#059669] border-[#10b981]/20',
    
    // Error
    error: isDark
      ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30'
      : 'bg-red-50 text-red-700 border-red-200',
  };
}

import { View, Text } from 'react-native';
import { styled } from 'nativewind';

export const Card = styled(View, 'bg-white dark:bg-black border-2 border-black/10 dark:border-white/10 rounded-xl overflow-hidden');
export const CardContent = styled(View, 'p-4');
export const CardHeader = styled(View, 'p-4 border-b border-black/10 dark:border-white/10');
export const CardTitle = styled(Text, 'text-lg font-bold text-gray-900 dark:text-gray-100');

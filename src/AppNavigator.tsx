import { createStackNavigator } from '@react-navigation/stack';

import HomePage from './HomePage';
import PreviewPage from './PreviewPage';

const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Preview" component={PreviewPage} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
import { StyleSheet } from 'react-native';
import GroceryList from '@/components/GroceryList';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <GroceryList />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

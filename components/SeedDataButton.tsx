import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

export default function SeedDataButton() {
  const [loading, setLoading] = useState(false);

  const handleSeedData = async () => {
    Alert.alert(
      'Sample Data',
      'Sample experiences have been added via SQL migrations. Check the Explore tab to see them!',
      [{ text: 'OK' }]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handleSeedData}
      disabled={loading}
    >
      <Text style={styles.buttonText}>
        View Sample Data
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
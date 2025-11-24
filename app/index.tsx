import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Modal, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function App() {

  const [screen, setScreen] = useState('Landing'); 
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  // Landing Screen
  if (screen === 'Landing') {
    return (
      <LinearGradient
        colors={['#6DD5FA', '#2980B9']}
        style={styles.landingContainer}
        
      >
        <View style={styles.logoContainer}>
          <Ionicons name="heart-circle" size={100} color="#fff" />
        </View>
        <Text style={styles.title}>HealthChecker</Text>
        <Text style={styles.subtitle}>Your personal health companion</Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setScreen('Home')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // Home Screen
  return (
    <View style={styles.container}>
      
      <TouchableOpacity 
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Open Health Info</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            
            <View style={styles.modalHeader}>
              <Ionicons name="medkit-outline" size={28} color="#4CAF50" />
              <Text style={styles.modalTitle}>Health Information</Text>
            </View>

            <View style={styles.checkboxRow}>
              <Checkbox
                value={checked}
                onValueChange={setChecked}
                color={checked ? "#4CAF50" : undefined}
              />
              <Text style={styles.checkboxText}>I agree to view this info</Text>
            </View>

            <ScrollView style={styles.infoBox}>
              <Text style={styles.info}>
                Regular health checkups help in early detection of diseases,
                track your vital signs, and keep your body functioning properly.
                Monitoring your health frequently reduces risks and ensures long-term wellness.
              </Text>
            </ScrollView>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.countButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonTextSmall}>Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonTextSmall}>Close</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  landingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  logoContainer: {
    marginBottom: 20
  },
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    color: '#e0f7fa',
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  openButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 15
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333'
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 16
  },
  infoBox: {
    maxHeight: 120,
    marginBottom: 15
  },
  info: {
    fontSize: 16,
    color: "#555"
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  countButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 12,
    width: "48%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButton: {
    backgroundColor: '#E84118',
    padding: 12,
    borderRadius: 12,
    width: "48%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTextSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5
  }
});

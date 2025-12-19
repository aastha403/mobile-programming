import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Firebase compat imports (already available via Firebase SDK)
declare global {
  var firebase: any;
}

// Initialize Firebase (will be done at runtime)
let auth: any;
let database: any;

const initFirebase = () => {
  if (typeof window !== 'undefined' && (window as any).firebase) {
    const fb = (window as any).firebase;
    const firebaseConfig = {
      apiKey: "AIzaSyD6nqGSufKspwAgNum86ZWNrGeVJruzR9o",
      authDomain: "mobile-programming-c6478.firebaseapp.com",
      databaseURL: "https://mobile-programming-c6478-default-rtdb.firebaseio.com",
      projectId: "mobile-programming-c6478",
      storageBucket: "mobile-programming-c6478.firebasestorage.app",
      messagingSenderId: "364333561930",
      appId: "1:364333561930:web:8198286602eb5877f5ceb3"
    };
    fb.initializeApp(firebaseConfig);
    auth = fb.auth();
    database = fb.database();
  }
};

export default function App() {

  const [screen, setScreen] = useState('Landing'); 
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Health Record States
  const [healthName, setHealthName] = useState('');
  const [age, setAge] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  // Auth State Listener
  useEffect(() => {
    initFirebase();
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((currentUser: any) => {
        setUser(currentUser);
        if (currentUser) {
          setScreen('Home');
          loadRecords(currentUser.uid);
        }
      });
      return unsubscribe;
    }
  }, []);

  // Load Records from Firebase
  const loadRecords = (uid: any) => {
    if (database) {
      const recordsRef = database.ref(`healthRecords/${uid}`);
      recordsRef.on('value', (snapshot: any) => {
        const data = snapshot.val();
        if (data) {
          const recordsList = Object.entries(data).map(([key, value]: any) => ({
            id: key,
            ...value
          }));
          setRecords(recordsList);
        } else {
          setRecords([]);
        }
      });
    }
  };

  // Sign Up
  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await database.ref(`users/${userCredential.user.uid}`).set({
        name: name,
        email: email
      });
      Alert.alert('Success', 'Account created!');
      setEmail('');
      setPassword('');
      setName('');
      setIsSignUp(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Sign In
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      await auth.signInWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Logged in!');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setRecords([]);
      setScreen('Landing');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Add Record
  const handleAddRecord = async () => {
    if (!healthName || !age || !heartRate || !bloodPressure) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      const recordsRef = database.ref(`healthRecords/${user.uid}`);
      const newRecordRef = recordsRef.push();
      await newRecordRef.set({
        name: healthName,
        age: age,
        heartRate: heartRate,
        bloodPressure: bloodPressure,
        timestamp: new Date().toISOString()
      });
      Alert.alert('Success', 'Record added!');
      setHealthName('');
      setAge('');
      setHeartRate('');
      setBloodPressure('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Delete Record
  const handleDeleteRecord = async (recordId: any) => {
    try {
      await database.ref(`healthRecords/${user.uid}/${recordId}`).remove();
      Alert.alert('Success', 'Record deleted!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Landing Screen
  if (screen === 'Landing') {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.landingContainer}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="heart-circle" size={100} color="#fff" />
        </View>
        <Text style={styles.title}>HealthChecker</Text>
        <Text style={styles.subtitle}>Your personal health companion</Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setIsSignUp(true)}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, {marginTop: 10, backgroundColor: '#764ba2'}]}
          onPress={() => setIsSignUp(false)}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Auth Modal */}
        <Modal visible={screen === 'Landing'} transparent animationType="slide">
          <View style={styles.modalWrapper}>
            <View style={styles.authBox}>
              <Text style={styles.modalTitle}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>

              {isSignUp && (
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#999"
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />

              <TouchableOpacity 
                style={styles.authButton}
                onPress={isSignUp ? handleSignUp : handleSignIn}
              >
                <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setIsSignUp(!isSignUp)}
                style={{marginTop: 15}}
              >
                <Text style={styles.toggleText}>
                  {isSignUp ? 'Already have account? Sign In' : 'Need account? Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    );
  }

  // Home Screen with Health Records
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome, {user?.displayName || 'User'}</Text>
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonTextSmall}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Add Health Record</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={healthName}
            onChangeText={setHealthName}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Heart Rate (bpm)"
            value={heartRate}
            onChangeText={setHeartRate}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Blood Pressure (e.g., 120/80)"
            value={bloodPressure}
            onChangeText={setBloodPressure}
            placeholderTextColor="#999"
          />

          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddRecord}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Record</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your Records ({records.length})</Text>
        {records.map((record) => (
          <View key={record.id} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <View>
                <Text style={styles.recordName}>{record.name}</Text>
                <Text style={styles.recordSubtitle}>Age: {record.age}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleDeleteRecord(record.id)}
              >
                <Ionicons name="trash-bin" size={20} color="#f5576c" />
              </TouchableOpacity>
            </View>
            <Text style={styles.recordDetail}>❤️ Heart Rate: {record.heartRate} bpm</Text>
            <Text style={styles.recordDetail}>📊 BP: {record.bloodPressure}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
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
    paddingTop: 40
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 10
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 5
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15
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
    elevation: 5,
    marginTop: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  input: {
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f8f9ff'
  },
  addButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 3
  },
  authBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 15
  },
  authButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    elevation: 3
  },
  toggleText: {
    textAlign: 'center',
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600'
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5
  },
  recordCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 3
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  recordName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  recordSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 3
  },
  recordDetail: {
    fontSize: 13,
    color: '#555',
    marginTop: 5
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
  }
});
// Firebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyD6nqGSufKspwAgNum86ZWNrGeVJruzR9o",
    authDomain: "mobile-programming-c6478.firebaseapp.com",
    databaseURL: "https://mobile-programming-c6478-default-rtdb.firebaseio.com",
    projectId: "mobile-programming-c6478",
    storageBucket: "mobile-programming-c6478.firebasestorage.app",
    messagingSenderId: "364333561930",
    appId: "1:364333561930:web:8198286602eb5877f5ceb3",
    measurementId: "G-613ECMS6HT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

console.log("✓ Firebase initialized successfully");

// ===== AUTHENTICATION FUNCTIONS =====

// Toggle between Sign In and Sign Up forms
document.getElementById('toggleAuth').addEventListener('click', toggleAuthForm);

function toggleAuthForm() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const toggleAuth = document.getElementById('toggleAuth');
    
    if (signInForm.style.display === 'none') {
        signInForm.style.display = 'block';
        signUpForm.style.display = 'none';
        toggleAuth.innerText = "Don't have an account? Sign Up";
        console.log("✓ Switched to Sign In form");
    } else {
        signInForm.style.display = 'none';
        signUpForm.style.display = 'block';
        toggleAuth.innerText = 'Already have an account? Sign In';
        console.log("✓ Switched to Sign Up form");
    }
}

// Sign In
document.getElementById('signInForm').addEventListener('submit', signIn);

function signIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("✓ User signed in:", userCredential.user.email);
            alert('✅ Welcome back!');
            showAppPage(userCredential.user);
        })
        .catch((error) => {
            console.error("✗ Sign in error:", error.message);
            alert('❌ Sign in failed: ' + error.message);
        });
}

// Sign Up
document.getElementById('signUpForm').addEventListener('submit', signUp);

function signUp(e) {
    e.preventDefault();
    
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("✓ User registered:", userCredential.user.email);
            
            // Save user profile
            userCredential.user.updateProfile({ displayName: name })
                .then(() => {
                    console.log("✓ User profile updated");
                    alert('✅ Account created successfully!');
                    showAppPage(userCredential.user);
                })
                .catch((error) => {
                    console.error("✗ Profile update error:", error.message);
                });
        })
        .catch((error) => {
            console.error("✗ Sign up error:", error.message);
            alert('❌ Sign up failed: ' + error.message);
        });
}

// Logout
function logoutUser() {
    if (confirm('Are you sure you want to sign out?')) {
        auth.signOut()
            .then(() => {
                console.log("✓ User signed out");
                alert('✅ Signed out successfully!');
                showAuthPage();
                // Clear forms
                document.getElementById('signInForm').reset();
                document.getElementById('signUpForm').reset();
                document.getElementById('healthForm').reset();
            })
            .catch((error) => {
                console.error("✗ Sign out error:", error.message);
                alert('❌ Sign out failed: ' + error.message);
            });
    }
}

// Show App Page (Home Page)
function showAppPage(user) {
    document.getElementById('authPage').classList.remove('active');
    document.getElementById('homePage').classList.add('active');
    document.getElementById('recordsPage').classList.remove('active');
    document.body.classList.remove('auth-mode');
    document.body.classList.add('app-mode');
    document.getElementById('homeUserEmailDisplay').innerText = user.email;
    
    // Display personalized greeting
    const displayName = user.displayName || user.email.split('@')[0];
    document.getElementById('homeUserName').innerText = `Hi, ${displayName}!`;
    
    console.log("✓ Home page displayed for user:", user.email);
}

// Navigate to Health Records
function goToHealthRecords() {
    document.getElementById('homePage').classList.remove('active');
    document.getElementById('recordsPage').classList.add('active');
    
    // Load health records
    loadRecords();
    
    // Update navbar with user info
    const user = auth.currentUser;
    if (user) {
        document.getElementById('userEmailDisplay').innerText = user.email;
    }
    
    console.log("✓ Health Records page displayed");
}

// Show Auth Page
function showAuthPage() {
    document.getElementById('authPage').classList.add('active');
    document.getElementById('homePage').classList.remove('active');
    document.getElementById('recordsPage').classList.remove('active');
    document.body.classList.add('auth-mode');
    document.body.classList.remove('app-mode');
    console.log("✓ Auth page displayed");
}

// Home page form submission
document.getElementById('homeHealthForm').addEventListener('submit', submitHomeHealthForm);

function submitHomeHealthForm(e) {
    e.preventDefault();

    const name = document.getElementById('homeName').value;
    const age = document.getElementById('homeAge').value;
    const email = document.getElementById('homeEmail').value;
    const heartRate = document.getElementById('homeHeartRate').value;
    const bloodPressure = document.getElementById('homeBloodPressure').value;

    saveData(name, age, email, '', '', '', '', heartRate, bloodPressure, '');

    // Reset form
    document.getElementById('homeHealthForm').reset();
    alert('✅ Health record saved successfully!');
    
    console.log("✓ Health record submitted from home page");
}

// Check authentication state on page load
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("✓ User already logged in:", user.email);
        showAppPage(user);
    } else {
        console.log("✓ No user logged in");
        showAuthPage();
    }
});

// ===== HEALTH RECORDS FUNCTIONS =====

// Form submission
document.getElementById('healthForm').addEventListener('submit', submitForm);

// Add cancel edit button
const formContainer = document.getElementById('healthForm').parentElement;
if (formContainer) {
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.innerText = 'Cancel Edit';
    cancelBtn.style.display = 'none';
    cancelBtn.style.background = '#95a5a6';
    cancelBtn.style.color = 'white';
    cancelBtn.style.padding = '10px 20px';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.marginLeft = '10px';
    cancelBtn.style.fontWeight = '600';
    cancelBtn.onclick = cancelEdit;
    formContainer.appendChild(cancelBtn);
}

function submitForm(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const bloodType = document.getElementById('bloodType').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const heartRate = document.getElementById('heartRate').value;
    const bloodPressure = document.getElementById('bloodPressure').value;
    const medicalHistory = document.getElementById('medicalHistory').value;

    if (window.currentEditingRecordId) {
        // UPDATE operation
        updateRecord(window.currentEditingRecordId, name, age, email, phone, bloodType, height, weight, heartRate, bloodPressure, medicalHistory);
    } else {
        // CREATE operation
        saveData(name, age, email, phone, bloodType, height, weight, heartRate, bloodPressure, medicalHistory);
    }

    // Reset form
    document.getElementById('healthForm').reset();
    window.currentEditingRecordId = null;
    const formButton = document.querySelector('#healthForm button[type="submit"]');
    formButton.innerText = 'Submit Record';
    formButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

// Save data to Firebase
function saveData(name, age, email, phone, bloodType, height, weight, heartRate, bloodPressure, medicalHistory) {
    const recordId = Date.now().toString();
    database.ref('healthRecords/' + recordId).set({
        name: name,
        age: age,
        email: email,
        phone: phone,
        bloodType: bloodType,
        height: height,
        weight: weight,
        heartRate: heartRate,
        bloodPressure: bloodPressure,
        medicalHistory: medicalHistory,
        timestamp: new Date().toISOString()
    }).then(() => {
        console.log("✓ Record saved successfully!");
    }).catch((error) => {
        console.error("✗ Error saving record:", error);
        alert('Error saving record: ' + error.message);
    });
}

// Retrieve and display data in real-time
function loadRecords() {
    const recordsRef = database.ref('healthRecords');
    recordsRef.on('value', (snapshot) => {
        const recordsList = document.getElementById('records');
        recordsList.innerHTML = '';
        
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const recordId = childSnapshot.key;
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${data.name}</td>
                    <td>${data.age}</td>
                    <td>${data.email}</td>
                    <td>${data.phone || 'N/A'}</td>
                    <td>${data.bloodType || 'N/A'}</td>
                    <td>${data.height || 'N/A'}</td>
                    <td>${data.weight || 'N/A'}</td>
                    <td>${data.heartRate}</td>
                    <td>${data.bloodPressure}</td>
                    <td>${data.medicalHistory || 'N/A'}</td>
                    <td>
                        <button onclick="editRecord('${recordId}')" style="background-color: #3498db; padding: 5px 10px; margin-right: 5px; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: 600;">Edit</button>
                        <button onclick="deleteRecord('${recordId}')" style="background-color: #e74c3c; padding: 5px 10px; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: 600;">Delete</button>
                    </td>
                `;
                
                recordsList.appendChild(row);
            });
            console.log("✓ Records displayed successfully");
        } else {
            recordsList.innerHTML = '<tr><td colspan="11" style="text-align: center; color: #999;">No health records found. Submit a record to get started!</td></tr>';
        }
    });
}

// Delete record from Firebase
function deleteRecord(recordId) {
    if (confirm('Are you sure you want to delete this record?')) {
        database.ref('healthRecords/' + recordId).remove()
            .then(() => {
                console.log("✓ Record deleted successfully!");
                alert('✅ Record deleted successfully!');
            })
            .catch((error) => {
                console.error("✗ Error deleting record:", error);
                alert('❌ Error deleting record: ' + error.message);
            });
    }
}

// Update record - Edit button functionality
function editRecord(recordId) {
    database.ref('healthRecords/' + recordId).once('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Navigate to health records page first
            goToHealthRecords();
            
            // Populate form with current data
            document.getElementById('name').value = data.name;
            document.getElementById('age').value = data.age;
            document.getElementById('email').value = data.email;
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('bloodType').value = data.bloodType || '';
            document.getElementById('height').value = data.height || '';
            document.getElementById('weight').value = data.weight || '';
            document.getElementById('heartRate').value = data.heartRate;
            document.getElementById('bloodPressure').value = data.bloodPressure;
            document.getElementById('medicalHistory').value = data.medicalHistory || '';
            
            // Store the current record ID for update
            window.currentEditingRecordId = recordId;
            
            // Change form submit behavior
            const formButton = document.querySelector('#healthForm button[type="submit"]');
            formButton.innerText = 'Update Record';
            formButton.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            
            // Scroll to form
            document.getElementById('healthForm').scrollIntoView({ behavior: 'smooth' });
            console.log("✓ Record loaded for editing");
        }
    });
}

// Cancel edit
function cancelEdit() {
    document.getElementById('healthForm').reset();
    window.currentEditingRecordId = null;
    const formButton = document.querySelector('#healthForm button[type="submit"]');
    formButton.innerText = 'Submit Record';
    formButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    console.log("✓ Edit cancelled");
}

// Update data in Firebase
function updateRecord(recordId, name, age, email, phone, bloodType, height, weight, heartRate, bloodPressure, medicalHistory) {
    database.ref('healthRecords/' + recordId).update({
        name: name,
        age: age,
        email: email,
        phone: phone,
        bloodType: bloodType,
        height: height,
        weight: weight,
        heartRate: heartRate,
        bloodPressure: bloodPressure,
        medicalHistory: medicalHistory,
        updatedAt: new Date().toISOString()
    }).then(() => {
        console.log("✓ Record updated successfully!");
        alert('✅ Health record updated successfully!');
    }).catch((error) => {
        console.error("✗ Error updating record:", error);
        alert('❌ Error updating record: ' + error.message);
    });
}

// READ operation - Retrieve all records
function readRecords() {
    return new Promise((resolve, reject) => {
        database.ref('healthRecords').once('value', (snapshot) => {
            if (snapshot.exists()) {
                const records = [];
                snapshot.forEach((childSnapshot) => {
                    records.push({
                        id: childSnapshot.key,
                        data: childSnapshot.val()
                    });
                });
                console.log("✓ Records retrieved successfully:", records);
                resolve(records);
            } else {
                console.log("✓ No records found");
                resolve([]);
            }
        }).catch((error) => {
            console.error("✗ Error reading records:", error);
            reject(error);
        });
    });
}

// CRUD Summary function
function crudOperationLog() {
    console.log("=== CRUD Operations Available ===");
    console.log("✓ CREATE: Submit form to create new health records");
    console.log("✓ READ: Records displayed in real-time table");
    console.log("✓ UPDATE: Click Edit button on any record to modify it");
    console.log("✓ DELETE: Click Delete button to remove records");
    console.log("===================================");
}

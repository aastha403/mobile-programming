// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6nqGSufKspwAgNum86ZWNrGeVJruzR9o",
    authDomain: "mobile-programming-c6478.firebaseapp.com",
    projectId: "mobile-programming-c6478",
    storageBucket: "mobile-programming-c6478.firebasestorage.app",
    messagingSenderId: "364333561930",
    appId: "1:364333561930:web:8198286602eb5877f5ceb3",
    measurementId: "G-613ECMS6HT",
    databaseURL: "https://mobile-programming-c6478-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get form and table elements
const form = document.getElementById('healthForm');
const recordsBody = document.getElementById('records');

// ==================== FORM SUBMISSION ====================
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;
    const heartRate = document.getElementById('heartRate').value;
    const bloodPressure = document.getElementById('bloodPressure').value;

    const record = {
        name: name,
        age: age,
        email: email,
        heartRate: heartRate,
        bloodPressure: bloodPressure,
        timestamp: new Date().toISOString()
    };

    const recordId = Date.now().toString();
    database.ref('healthRecords/' + recordId).set(record)
        .then(function() {
            console.log("✓ Record saved:", recordId);
            alert('✅ Record created! ID: ' + recordId);
            form.reset();
            loadRecords();
        })
        .catch(function(error) {
            alert('❌ Error: ' + error.message);
        });
});

// ==================== READ FUNCTION ====================
function loadRecords() {
    database.ref('healthRecords').on('value', function(snapshot) {
        recordsBody.innerHTML = '';
        if (snapshot.exists()) {
            const records = snapshot.val();
            console.log("✓ Records loaded: " + Object.keys(records).length);
            Object.keys(records).forEach(function(key) {
                const record = records[key];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.name}</td>
                    <td>${record.age}</td>
                    <td>${record.email}</td>
                    <td>${record.heartRate}</td>
                    <td>${record.bloodPressure}</td>
                    <td><button onclick="deleteRecord('${key}')" style="background-color: #e74c3c; padding: 8px 12px; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.backgroundColor='#c0392b'; this.style.transform='scale(1.05)'" onmouseout="this.style.backgroundColor='#e74c3c'; this.style.transform='scale(1)'">Delete</button></td>
                `;
                recordsBody.appendChild(row);
            });
        } else {
            recordsBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No records. Submit to add!</td></tr>';
        }
    });
}

// ==================== DELETE FUNCTION ====================
function deleteRecord(recordId) {
    if (confirm('⚠️ Are you sure you want to delete this record?')) {
        database.ref('healthRecords/' + recordId).remove()
            .then(function() {
                console.log("✓ Record deleted:", recordId);
                alert('✅ Record deleted successfully!');
                loadRecords();
            })
            .catch(function(error) {
                alert('❌ Error deleting record: ' + error.message);
                console.error("✗ DELETE error:", error);
            });
    }
}

// ==================== UPDATE FUNCTION ====================
function performUpdate(recordId, record) {
    database.ref('healthRecords/' + recordId).update(record)
        .then(function() {
            console.log("✓ UPDATE success:", recordId);
            alert('✅ Updated! ID: ' + recordId);
            form.reset();
            currentOperation = 'CREATE';
            loadRecords();
        })
        .catch(function(error) {
            console.error("✗ UPDATE error:", error);
            alert('❌ Error: ' + error.message);
        });
}

console.log("✓ HealthChecker App initialized!");
loadRecords();

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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// TAB NAVIGATION
function openTab(tabId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

// FORM SUBMIT
document.getElementById("healthForm").addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    const data = {
        name: name.value,
        age: age.value,
        email: email.value,
        heartRate: heartRate.value,
        bloodPressure: bloodPressure.value,
        medicalHistory: medicalHistory.value
    };

    database.ref("healthRecords").push(data);
    alert("Record Saved Successfully!");
    e.target.reset();
}


// READ DATA
database.ref("healthRecords").on("value", snapshot => {
    const records = document.getElementById("records");
    records.innerHTML = "";

    snapshot.forEach(child => {
        const d = child.val();
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${d.name}</td>
            <td>${d.age}</td>
            <td>${d.email}</td>
            <td>${d.heartRate}</td>
            <td>${d.bloodPressure}</td>
            <td>
                <button class="action-btn delete" onclick="deleteRecord('${child.key}')">Delete</button>
            </td>
        `;

        records.appendChild(row);
    });
});

// DELETE
function deleteRecord(id) {
    if (confirm("Delete this record?")) {
        database.ref("healthRecords/" + id).remove();
    }
}

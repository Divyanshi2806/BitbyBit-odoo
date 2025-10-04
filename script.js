// Panel switch buttons
const overlaysignin = document.getElementById('signin');
const overlaysignup = document.getElementById('overlaysignup');
const container = document.getElementById('container');

overlaysignup.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

overlaysignin.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// Form signup button
const formsignup = document.getElementById('formsignup');
formsignup.addEventListener('click', () => {
    const name = document.querySelector('input[placeholder="Name"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const company = document.querySelector('input[placeholder="Company Name"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;
    const confirmPassword = document.querySelector('input[placeholder="Confirm Password"]').value;
    const role = document.getElementById('role').value;

    if (!name || !email || !company || !password || !confirmPassword || !role) {
        alert("Please fill all fields and select a role.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                company: company,
                role: role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            // Redirect based on role
            if (role === "admin") {
                window.location.href = "admin.html";
            } else if (role === "manager") {
                window.location.href = "manager.html";
            } else if (role === "employee") {
                window.location.href = "employee.html";
            }
        })
        .catch((error) => {
            console.error("Signup error:", error);
            alert(error.message);
        });
});
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwO_m2MDgUjJHeAytlZD67rabu2eyMkhk",
  authDomain: "expense-management-fba1c.firebaseapp.com",
  projectId: "expense-management-fba1c",
  storageBucket: "expense-management-fba1c.appspot.com",
  messagingSenderId: "295675537951",
  appId: "1:295675537951:web:ac11d0d8e5510ba469832a"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

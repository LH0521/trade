const firebaseConfig = {
    apiKey: "AIzaSyCQU1VQQKQO3LUhClBM9Q0dN57OKSAj3C8",
    authDomain: "trade-a9ab6.firebaseapp.com",
    projectId: "trade-a9ab6",
    storageBucket: "trade-a9ab6.appspot.com",
    messagingSenderId: "788359878183",
    appId: "1:788359878183:web:7c49adede1276174302002"
};

firebase.initializeApp(firebaseConfig);

const loginView = document.getElementById('loginView');
const createProfileView = document.getElementById('createProfileView');
const editProfileView = document.getElementById('editProfileView');

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            checkUserProfile();
        })
        .catch((error) => {
            console.error("Authentication error: ", error);
        });
}

function signOut() {
    firebase.auth().signOut().then(() => {
        showView('login');
    });
}

function checkUserProfile() {
    const user = firebase.auth().currentUser;
    if (user) {
        const userId = user.uid;
        firebase.firestore().collection("profiles").doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    loadEditProfile(doc.data());
                } else {
                    showView('createProfile');
                }
            });
    } else {
        showView('login');
    }
}

function showView(view) {
    loginView.style.display = view === 'login' ? 'block' : 'none';
    createProfileView.style.display = view === 'createProfile' ? 'block' : 'none';
    editProfileView.style.display = view === 'editProfile' ? 'block' : 'none';
}

function loadEditProfile(data) {
    document.getElementById('editUsername').value = data.username;
    document.getElementById('editAge').value = data.age;
    showView('editProfile');
}

function saveProfile() {
    const user = firebase.auth().currentUser;
    const username = document.getElementById('username').value;
    const age = document.getElementById('age').value;

    const profileRef = firebase.firestore().collection("profiles").doc(user.uid);

    profileRef.get().then((doc) => {
        if (doc.exists) {
            alert("This username already exists, please choose another.");
        } else {
            profileRef.set({
                username: username,
                age: age,
                userId: user.uid
            })
                .then(() => {
                    window.location.href = `https://lh0521.github.io/trade/${username}/`;
                });
        }
    });
}

function updateProfile() {
    const user = firebase.auth().currentUser;
    const newUsername = document.getElementById('editUsername').value;
    const newAge = document.getElementById('editAge').value;

    const profileRef = firebase.firestore().collection("profiles").doc(user.uid);

    profileRef.update({
        username: newUsername,
        age: newAge
    })
        .then(() => {
            alert("Profile updated successfully!");
            window.location.href = `https://lh0521.github.io/trade/${newUsername}/`;
        });
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        checkUserProfile();
    } else {
        showView('login');
    }
});

// Importation des modules nécessaires de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';

// Configuration de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCf365nL5CDv4x-LtXxsD8Jr2cmswA4SZg",
    authDomain: "hotaam-50e9c.firebaseapp.com",
    projectId: "hotaam-50e9c",
    storageBucket: "hotaam-50e9c.firebasestorage.app",
    messagingSenderId: "356140605826",
    appId: "1:356140605826:web:a136cae33c5d6c34976f9b"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de l'authentification et de la base de données
const auth = getAuth(app);
const db = getDatabase(app);

// Fonction pour gérer la connexion et l'inscription
export async function handleLoginAndSignup(e) {
    e.preventDefault();

    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;

    // Validation des champs
    if (!role) {
        alert("Veuillez choisir un rôle.");
        return;
    }
    if (password.length < 6) {
        alert("Le mot de passe doit comporter au moins 6 caractères.");
        return;
    }
    if (phone.toString().length < 13) {
        alert("Votre numéro est invalide.");
        return;
    }

    try {
        // Tentative d'inscription de l'utilisateur
        let userCredential = await createUserWithEmailAndPassword(auth, phone + "@gmail.com", password);
        let user = userCredential.user;

        // Référence dans la base de données en fonction du rôle
        const userRef = role === 'client' ? ref(db, 'users/client/' + user.uid) : ref(db, 'users/chauffeur/' + user.uid);

        // Enregistrement dans la base de données
        await set(userRef, { phone, "credit": "0", "course": "0", password, role });
		//localStorage.setItem("xotaam-user", JSON.stringify(user));
		localStorage.setItem("xotaam-user","0"+"/0/"+password+"/"+phone+"/"+role);
		localStorage.setItem("isConnected",1);
        // Redirection selon le rôle
        if (role === 'client') {
            window.location.href = '/xotaam/client';
        } else if (role === 'chauffeur') {
            window.location.href = '/xotaam/driver';
        }

    } catch (error) {
        console.error("Erreur d'inscription:", error); // Ajout d'un log pour l'erreur

        // Gestion des erreurs : email déjà utilisé
        if (error.code === "auth/email-already-in-use") {
            try {
                // Si l'email est déjà utilisé, tentez de connecter l'utilisateur
                let userCredential = await signInWithEmailAndPassword(auth, phone + "@gmail.com", password);
                let user = userCredential.user;
                const userRef = role === 'client' ? ref(db, 'users/client/' + user.uid) : ref(db, 'users/chauffeur/' + user.uid);
                
                // Récupérer les données de l'utilisateur depuis la base de données
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    if (userData.role === role) {
						let us = JSON.stringify(userData);
						us = us.replace(/course|credit|password|phone|role/g, (match) => {
						  if (match === 'course'||match === 'credit'||match === 'password'||match === 'phone'||match === 'role') return '';
						});
						let resul = "";
						for (let i = 0; i < us.length; i++) {
						if (us[i] !== ':' && us[i] !== '"'&& us[i] !== '}'&& us[i] !== '{') {
								resul += us[i];
							}
						}
						us = resul.replace(/,/g, '/');
						//saving data 
						localStorage.setItem("xotaam-user",us);
						localStorage.setItem("isConnected",1);
						// Redirection vers le bon tableau de bord en fonction du rôle
                        window.location.href = role === 'client' ? '/xotaam/client' : '/xotaam/driver';
                    } else {
                        alert("Le rôle de l'utilisateur ne correspond pas.");
                    }
                } else {
                    // Si l'utilisateur existe dans Firebase Auth mais pas dans la base de données, on l'ajoute
                    await set(userRef, { phone, "credit": "0", "course": "0", password, role });
					//localStorage.setItem("xotaam-user", JSON.stringify(user));
					localStorage.setItem("xotaam-user","0"+"/0/"+password+"/"+phone+"/"+role);
					localStorage.setItem("isConnected",1);
                    window.location.href = role === 'client' ? '/xotaam/client' : '/xotaam/driver';
                }
            } catch (innerError) {
                console.error("Erreur lors de la tentative de connexion:", innerError); // Ajout d'un log pour l'erreur
                if (innerError.code === "auth/invalid-login-credentials") {
                    alert("Mot de passe incorrect.");
                } else {
                    alert("Une erreur s'est produite, veuillez réessayer.");
                }
            }
        } else {
            alert("Une erreur s'est produite, veuillez réessayer.");
        }
    }
}

// Ajouter l'écouteur d'événement pour le formulaire de connexion dans le HTML
document.getElementById('loginForm').addEventListener('submit', handleLoginAndSignup);

window.onload = function(){
	let connect = localStorage.getItem("isConnected");
	if(connect==1){
		let data = localStorage.getItem("xotaam-user").split("/");
		let role = data[4];
		window.location.href = role === 'client' ? '/xotaam/client' : '/xotaam/driver';
	}
}
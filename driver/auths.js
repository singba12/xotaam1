// Importation des modules nécessaires de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getDatabase, ref, set, get , remove,onChildAdded, onChildRemoved,onDisconnect} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

// Configuration de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCf365nL5CDv4x-LtXxsD8Jr2cmswA4SZg",
    authDomain: "hotaam-50e9c.firebaseapp.com",
    projectId: "hotaam-50e9c",
    storageBucket: "hotaam-50e9c.firebasestorage.app",
    messagingSenderId: "356140605826",
    appId: "1:356140605826:web:a136cae33c5d6c34976f9b"
};
let numero = 0;
let course = 0;
// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de l'authentification et de la base de données
export const auth = getAuth(app);
export const db = getDatabase(app);


document.getElementById('logout-btn').addEventListener('click', async function() {
    try {
        // Déconnexion de l'utilisateur
		let userConfirm = confirm("Voulez-vous vous déconnecter?");

		if (userConfirm) {
			await signOut(auth);
			localStorage.setItem("isConnected",0);
			// Redirection vers la page de connexion après déconnexion
			window.location.href = '/xotaam/login'; // Remplacez par votre URL de page de connexion
		} 
    } catch (error) {
        console.error("Erreur lors de la déconnexion : ", error);
        alert("Une erreur s'est produite lors de la déconnexion. Veuillez réessayer.");
    }
});
 const userRef = ref(db, 'disponibility/'+rand())
function rand(){
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 10;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
}
let auCas = "";
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('availability-toggle');
  if (toggle) {
    toggle.addEventListener('change', async function () {
      try {
        if (this.checked) {
          await set(userRef, { numero, course });
		  auCas = userRef;
        } else {
          // Supprime les données
          await remove(userRef);
        }
      } catch (error) {
        console.error("Une erreur s'est produite : ", error);
      }
    });
  }
});



// récupére les données 
window.onload = function(){
	let connect = localStorage.getItem("isConnected");
	if(connect != 1){window.location.href = '/xotaam/login'}
	else{
		let data = localStorage.getItem("xotaam-user").split("/");
		document.getElementById("current-balance").innerText = "Solde : "+data[1]+"F";
		document.getElementById("name").innerText = data[3];
		let role = data[4];
		numero = data[3];
		course = data[0];
		//alert(role)
		if(role === 'client'){window.location.href = '/xotaam/client'};
		return;
	}
}

// Sélectionner le corps du tableau
const tbody = document.getElementById('drivers-table').getElementsByTagName('tbody')[0];

// Fonction pour ajouter un chauffeur dans le tableau
function addDriverToTable(driverId, driverData) {
  const row = tbody.insertRow(); // Créer une nouvelle ligne
  row.setAttribute('data-driver-id', driverId); // Ajouter un attribut pour identifier la ligne
  row.innerHTML = `
	<td>${driverId}</td>
	<td>${driverData.numero}</td>
	<td>${driverData.course || 0}</td>
  `;
}

// Fonction pour supprimer un chauffeur du tableau
function removeDriverFromTable(driverId) {
  const rows = tbody.getElementsByTagName('tr');
  for (let row of rows) {
	if (row.getAttribute('data-driver-id') === driverId) {
	  tbody.deleteRow(row.rowIndex-1);
	  break;
	}
  }
}

const newUse = ref(db, 'disponibility/');
// Écoute l'ajout de nouveaux chauffeurs
onChildAdded(newUse, (snapshot) => {
  const driverId = snapshot.key;
  const driverData = snapshot.val();
	
	addDriverToTable(driverId, driverData);
  
});

// Écoute la suppression d'un chauffeur
onChildRemoved(newUse, (snapshot) => {
  const driverId = snapshot.key;

  // Supprime le chauffeur du tableau si il devient indisponible
  removeDriverFromTable(driverId);
});

// Fonction pour gérer la déconnexion de Firebase Realtime Database
function handlePageUnload() {
  // Supprimer la connexion en temps réel
  onDisconnect(auCas).remove();  // Supprime la référence lorsque l'utilisateur se déconnecte
}

// Écouter l'événement avant la fermeture de la page
window.addEventListener('beforeunload', handlePageUnload);
 window.onoffline = handlePageUnload();
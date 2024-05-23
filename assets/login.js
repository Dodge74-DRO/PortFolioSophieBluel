const apiUrl = "http://localhost:5678/api/";
const email = document.getElementById("btn_email");
const password = document.getElementById("btn_password");
const submit = document.getElementById("btn_submit");
const loginEmailError = document.querySelector(".ErLoginEmail");
const loginMdpError = document.querySelector(".ErLoginMdp");
console.log(email, password, submit)
// vérifier si User déjà connecté ********************/
alreadyLogged();
function alreadyLogged() {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        const p = document.createElement("p");
        p.innerHTML = "<br><br>Vous avez été déconnecté(e), reconnectez vous<br>ou retour ou fermer la page";
        loginEmailError.innerHTML = " ";
        loginEmailError.appendChild(p);
        return;
    }
}
// ***************************************************/
// Au clic, on envoie les valeurs de connexion *******/
btn_submit.addEventListener("click", () => {
    let userParam = {
        email: email.value,
        password: password.value
    };
    LoginUser(userParam);
});
// ***************************************************/
// vérification email et psw + envoi serveur *********/
function LoginUser(userParam) {
    // mettre à blanc zone erreur mail psw
    loginEmailError.innerHTML = " ";
    loginMdpError.innerHTML = " ";
    // vérifier user email
    if (!userParam.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "<br><br>adresse email invalide";
        loginEmailError.appendChild(p);
        return;
    }
    // vérifier user password
    if (!userParam.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "<br><br>le mot de passe doit contenir : 6 caractères mini<br> au moins 1 majuscule, 1 minuscule et 1 chiffre";
        loginMdpError.appendChild(p);
        return;
    }
    // on est OK pour l'envoi des données et recevoir le token du serveur    
    fetch(apiUrl+'users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(userParam)
    })
        .then(response => response.json())
        .then(result => {
            // Si couple email/mdp incorrect
            if (result.error || result.message) {
                const p = document.createElement("p");
                p.innerHTML = `<br><br>Email et/ou mot de passe erroné(s)`;
                loginMdpError.appendChild(p);
                return;
                // Si couple email/mdp correct
            } 
            if (result.token) {
                // enregistrer le jeton retourner par le serveur pour les transactions
                localStorage.setItem("token", result.token);
                // retourner sur la page d'accueil
                window.location.href = "index.html";
            }
        })
        // mettre un message pour la console
        .catch(error =>
            console.log(error));
}
// ***************************************************/

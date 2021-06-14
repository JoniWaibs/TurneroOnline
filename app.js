(() => {

  ///////////////SELECTORES/////////////////////////
  //Usuario y contraseña
  const signUp = document.querySelector("#signUp");
  const signIn = document.querySelector("#signIn");
  //Gogle
  let googleUp = document.querySelector("#googleUp");
  let googleIn = document.querySelector("#googleIn");
  //Facebook
  let facebookUp = document.querySelector("#facebookUp");
  let facebookIn = document.querySelector("#facebookIn");




 ///////////////EVENTOS/////////////////////////
  //Funcion y evento que registra un nuevo user por mail & password
  signUp.addEventListener("submit", (e) => {
    e.preventDefault();
    //Capturando los datos
    const mail = document.querySelector("#mail").value;
    const pass = document.querySelector("#pass").value;
    //Guardando en Firestone
    firebase.auth()
      .createUserWithEmailAndPassword(mail, pass)
      .then((user) => {
        console.log(user);
        signUp.reset();
        $("#registrarUser").modal("hide");
      })
      .catch((error) => {
        // Handle Errors here.
        signUp.reset();
        var errorCode = error.code;
        var errorMessage = error.message;
        //Alert
        Swal.fire({
          icon: 'error',
          title: 'HEY!',
          text: 'Parece que ya estas registrado, iniciá Sesión!',
        })
        console.log(errorCode, errorMessage);
      });
  });
  //Iniciar Sesion con correo & contraseña
  signIn.addEventListener("submit", (e) => {
    e.preventDefault();
    //Capturando los datos
    const mail = document.querySelector("#mailIniciar").value;
    const pass = document.querySelector("#passIniciar").value;
    //Autenticando en firestore
    firebase.auth()
      .signInWithEmailAndPassword(mail, pass)
      .then((user) => {
        console.log("Ingresando a tu perfil");
        console.log(user);
        setTimeout(() => {
          signIn.reset();
          $("#iniciarSesion").modal("hide");
          // window.location.href = "perfil.html";
        }, 800);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        signIn.reset();
        console.log(errorCode, errorMessage);
        //Alert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Parece que aún no te has registrado!',
        })
      });
  });
  //Eventos Registrar e Iniciar Sesion con GOOGLE
  //Ambos botones de google ejecutan la misma funcion
  googleUp.addEventListener("click", googleSignIn);
  googleIn.addEventListener("click", googleSignIn);
  //Eventos Registrar e Iniciar Sesion con FACEBOOK
  //Ambos botones de FACEBOOK ejecutan la misma funcion
  facebookIn.addEventListener('click', facebookSignIn);
  facebookUp.addEventListener('click', facebookSignIn);


  ///////////////FUNCIONES/////////////////////////
  //Funcion Registrar e Iniciar Sesion con GOOGLE
  function googleSignIn(e) {
    e.preventDefault()
    console.log("click en google");
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        //Credenciales
        var token = result.credential.accessToken;
        // User info
        var user = result.user;
        console.log(result, token, user);
      })
      .catch(function (error) {
        //Hubo un error
        console.log(error);
      });
  };
  //Funcion Registrar e Iniciar Sesion con FACEBOOK
  function facebookSignIn(e){
    e.preventDefault()
    console.log('facebook')
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        //Credenciales
        var token = result.credential.accessToken;
        //user info.
        var user = result.user;
        console.log(result, token, user);
      })
      .catch(function (error) {
        //Hubo un error
        console.log(error);
      });
  };
  //Observar los cambios que van sucediendo
  observer();
  function observer() {
    firebase.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        let email = user.email;
        let uid = user.uid;
        //Si el user es admin, lo dispara a su perfil
        if(email === 'admin@admin.com' && uid === '6o6osg8MYJfeNC78h7SovdVZg4H3'){
          window.location.href = "admin.html";
        }else{
          window.location.href = "perfil.html";
        }
      } else {
        console.log("fuera del perfil");
      }
    });
  };
})();

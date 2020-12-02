/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCZGQtTH8GqH-kn5C3X94fs1yjHDf2_c9w",
  authDomain: "move-gimnasio.firebaseapp.com",
  databaseURL: "https://move-gimnasio.firebaseio.com",
  projectId: "move-gimnasio",
  storageBucket: "move-gimnasio.appspot.com",
  messagingSenderId: "783633610888",
  appId: "1:783633610888:web:e981dec76543ac4f1f473d",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Firebase auth
const auth = firebase.auth();
//Firestore ddbb
const firestore = firebase.firestore();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//DISPONIBILIZA LA BASE DE DATOS
export const getDataBase = async()=>{
    try{
        const response = firestore.collection("Turnos")
        return response;
    }catch(error){
        console.log(error)
    };
};
//BORRA UN ELEMENTO DE LA BASE DE DATOS
export function borrarTurnoDataBase(id, borrarHTML){
  firestore.collection("Turnos").doc(id).delete().then(function() {
    console.log("Document successfully deleted!");
    borrarHTML.remove()
}).catch(function(error) {
    console.error("Error removing document: ", error);
});
};
//GUARDAR NUEVO TURNO
export function guardarTurno(activity, date, displayName, sucursal , email , hour , wp){

  firestore
  .collection("Turnos")
  .add({
    Actividad: activity,
    Dia: date,
    Nombre: displayName,
    Sucursal: sucursal,
    email: email,
    hora: hour,
    whatsapp: wp,
  })
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);

    //Alerta de exito.
    Swal.fire({
      title: "Turno cargado con éxito",
      text: "Podes seguir cargando turnos",
      icon: "success",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Quiero otro turno`,
      denyButtonText: `Salir!`,
      denyButtonColor: "#dc3545",
      confirmButtonColor: "#28a745",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("Seguí sumando turnos");
      } else if (result.isDenied) {
        $("#turnoModal").modal("hide");
      }
    });
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
    //Alerta error en la ddbb
    Swal.fire({
      title: "Ups! Parece que hay un error!",
      text: "No se pudo guardar el turno, intentá nuevamente",
      icon: "error",
      confirmButtonText: "Entendido!",
    });
  });





};






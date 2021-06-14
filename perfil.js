import {
  activities,
  dates,
  horario,
  sucursales,
} from "./JavaScript/Selectores.js";
import {
  cargaActivity,
  cargaDate,
  cargaHour,
  cargaSucursal,
} from "./JavaScript/Functions.js";
import { guardarTurno, getDataBase } from "./Firebase/Settings.js";
(() => {
  ///////////////SELECTORES/////////////////////////
  //Variables con los datos del perfil del usuario disponibles
  let displayName;
  let email;
  let emailVerified;
  let photoURL;
  let isAnonymous;
  let uid;
  let providerData;
  //Formulario de turnos
  let turnoForm = document.querySelector("#turnoForm");

  ///////////////EVENTOS/////////////////////////
  //Cargar los selects con las options
  document.addEventListener("DOMContentLoaded", () => {
    cargaActivity(activities);
    cargaDate(dates);
    cargaHour(horario);
    // cargaSucursal(sucursales);
  });
  //Evento y Funcion, CIERRA EL MODAL DE TURNOS CON BOTON
  const cerrarTurno = document.querySelector("#cerrarTurno");
  cerrarTurno.addEventListener("click", () => {
    $("#turnoModal").modal("hide");
  });
  //Evento que Genera el nuevo turno
  turnoForm.addEventListener("submit", dataRead);

  ///////////////FUNCIONES/////////////////////////
  //Funcion que lee todos los datos del turno, los valida y guarda en la ddbb
  async function dataRead(e) {
    e.preventDefault();
    const sucursal = document.querySelector("#sucursal").value;
    const activity = document.querySelector("#activity").value;
    const date = document.querySelector("#date").value;
    const hour = document.querySelector("#hour").value;
    const area = document.querySelector("#area").value;
    const number = document.querySelector("#number").value;
    const wp = area + number;

    //Comprueba que no lleguen vacios (validacion)
    if (
      sucursal === "selected" ||
      activity === "selected" ||
      date === "selected" ||
      hour === "selected" ||
      wp === ""
    ) {
      //Alerta error
      Swal.fire({
        title: "Ups! Parece que hay un error!",
        text: "Faltan completar datos.",
        icon: "error",
        confirmButtonText: "Entendido!",
      });
    } else {
      let StockTurnos = []
      const DB = await getDataBase()
      await DB.where("Dia", "==", date).where("hora", "==", hour).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          StockTurnos = [...StockTurnos, doc.data()]
        });
      })
      console.log(StockTurnos.length)
      if(StockTurnos.length < 12){
        // Nuevo turnno generado, y guardado en la base de datos
        guardarTurno(activity, date, displayName, sucursal, email, hour, wp, uid);
        //reseto el form
        turnoForm.reset();
      }else{
        //Alerta error
        Swal.fire({
          title: "Ups! Parece que este horario esta lleno!",
          text: "Saca turno en un horario distinto!",
          icon: "error",
          confirmButtonText: "Entendido!",
        });
      }

    }
  };
  //Funcion que Observar los cambios que van sucediendo
  observer();
  function observer() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName === null) {
          displayName = user.email;
          email = user.email;
          emailVerified = user.emailVerified;
          photoURL = user.photoURL;
          isAnonymous = user.isAnonymous;
          uid = user.uid;
          providerData = user.providerData;
          //Si entra por email & pass pedir nomb
          //Y setearlo en la ddbb
          console.log(emailVerified);
          if(displayName === 'admin@movecenter.com' ){
            window.location.href = "admin.html";
          };
        } else {
          // User is signed in.
          displayName = user.displayName;
          email = user.email;
          emailVerified = user.emailVerified;
          photoURL = user.photoURL;
          isAnonymous = user.isAnonymous;
          uid = user.uid;
          providerData = user.providerData;
          //Y setearlo en la ddbb
          console.log(emailVerified);
          console.log(displayName);
        };
      }
    });
  };
  //Funcion + evento logout
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", () => {
    console.log("cerrando sesion");
    firebase
      .auth()
      .signOut()
      .then((user) => {
        console.log("cerrando sesion");
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });
})();

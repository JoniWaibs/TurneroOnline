import { activities, dates, horario, sucursales } from "./JavaScript/Selectores.js";
import { cargaActivity , cargaDate , cargaHour , cargaSucursal} from './JavaScript/Functions.js'
import { getDataBase , borrarTurnoDataBase } from "./Firebase/Settings.js";
(() => {
  ///////////////SELECTORES/////////////////////////
  //Selectores del perfil del user
  let displayName;
  let email;
  let emailVerified;
  let photoURL;
  let isAnonymous;
  var uid = "";
  let providerData;
  //Seccion de turnos en el html
  const mainTurnos = document.querySelector("#mainTurnos tbody");
  //Selectores de los campos del filatrado
  let activ = document.querySelector("#activity");
  let dateSelect = document.querySelector("#date");
  let hour = document.querySelector("#hour");
  let suc = document.querySelector("#sucursal");
  let name = document.querySelector("#name");
  let limpiarFiltros = document.querySelector("#quitar");
  let FormularioFiltro = document.querySelector('#filterForm')
  //Objeto para el filtrado
  const datosBusqueda = {
    Actividad: "",
    Dia: "",
    hora: "",
    Sucursal: "",
    Nombre: "",
  };
  //Array que comienza vacio y almacenara todos los turnos
  let turnos = [];
  //Registros por pagina
  let qRegistros = 100;
  let totalPaginas;
  //Selector boton logout
  const logout = document.querySelector("#logout");




  ///////////////EVENTOS/////////////////////////
  //Eventos que trae la ddbb y genera todos los html necesario
  document.addEventListener("DOMContentLoaded", async () => {
    //Alerta descargando los turnos de la base de datos
    let timerInterval;
    Swal.fire({
        title: "Descargando Turnos",
        html: "Aguarde un momento por favor!",
        timer: 2000,
        timerProgressBar: true,
        willOpen: () => {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            const content = Swal.getContent();
            if (content) {
              const b = content.querySelector("b");
              if (b) {
                b.textContent = Swal.getTimerLeft();
              }
            }
          }, 100);
        },
        onClose: () => {
          clearInterval(timerInterval);
        },
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("Turnos descargados");
        }
    });
    //consigo la base de datos
    const dataBase = await getDataBase();
    //Gestionar la base de datos
    gestionarDataBase(dataBase);
    //Gestionar la carga de filtros
    cargaActivity(activities);
    cargaDate(dates);
    cargaHour(horario);
    cargaSucursal(sucursales);
  });
  //Eventos que generan el objeto filtrado
  activ.addEventListener("change", (e) => {
    datosBusqueda.Actividad = e.target.value;
    console.log(datosBusqueda);
    filtrarTurnos();
  });
  dateSelect.addEventListener("change", (e) => {
    datosBusqueda.Dia = e.target.value;
    console.log(datosBusqueda);
    filtrarTurnos();
  });
  hour.addEventListener("change", (e) => {
    datosBusqueda.hora = e.target.value;
    console.log(datosBusqueda);
    filtrarTurnos();
  });
  suc.addEventListener("change", (e) => {
    datosBusqueda.Sucursal = e.target.value;
    console.log(datosBusqueda);
    filtrarTurnos();
  });
  //Evento que limpia el filtrado
  limpiarFiltros.addEventListener("click", () => {
    //Vacia el objeto de filtrado
    (datosBusqueda.Actividad = ""),
    (datosBusqueda.Dia = ""),
    (datosBusqueda.hora = ""),
    (datosBusqueda.Sucursal = ""),
    (datosBusqueda.Nombre = "");
    FormularioFiltro.reset();
    //Vuelve a ejecutar la function
    showHtml(turnos);
    return false;
  });
  //Evento que busca la clase eliminar para borrar turnos
  mainTurnos.addEventListener('click', borrarTurno)
  //Evento que cierra la sesion
  logout.addEventListener("click", logOut);





  ///////////////FUNCIONES/////////////////////////
  //Funcion que gestiona la base de datos
  async function gestionarDataBase(dataBase) {
    //Recorrerla, completar el array, y mostrar los datos en el html
    await dataBase.orderBy("Dia", 'asc').get().then((querySnapShot) => {
      querySnapShot.forEach((doc) => {
        //Llenar el array con este objeto
        const turno = {
          Actividad:  doc.data().Actividad,
          Dia: doc.data().Dia,
          Nombre: doc.data().Nombre,
          Sucursal: doc.data().Sucursal,
          email: doc.data().email,
          hora: doc.data().hora,
          whatsapp: doc.data().whatsapp,
          id: doc.id
        }
        turnos.push(turno);
      });
    });

    showHtml(turnos);
  };
  //Funcion que muestra los turnos en el html
  function showHtml(turnos) {
    //Generar el paginador
    //comparar las fechas con moment para mostrar solo los turnos del dia

    //Limpia el html previo
    clearHTML();
    //Comprueba que haya turno
    if (turnos.length >= 1) {
      //Recorre ele array de turnos y los pinta en el html
      turnos.forEach((turno) => {
        let { Actividad, Sucursal, Nombre, Dia, hora, whatsapp , id} = turno;

        mainTurnos.innerHTML += `
                              <tr>
                                  <td>${Actividad}</td>
                                  <td class="text-fluo-orange text-uppercase font-weight-bold">${Sucursal}</td>
                                  <td>${Nombre}</td>
                                  <td>${Dia}</td>
                                  <td>${hora}</td>
                                  <td class="text-fluo-green">${whatsapp}</td>
                                  <td class="p-0 "><a class=" btn btn-sm btn-danger eliminar"  data-id="${id}" >Eliminar</a></td>
                              </tr>
                              `;
      });
    } else {
      //No tenemos turnos para mostrar si el array esta vacio
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No hay ningun turno para mostrar!",
      });
    }
  };
  //Funcion que limpia el HTML previo
  function clearHTML() {
    while (mainTurnos.firstChild) {
      mainTurnos.removeChild(mainTurnos.firstChild);
    }
  };
  //Funcion que recibe los datos del pbjeto para filtrar
  function filtrarTurnos() {
    //Encadeno todos los filtros en la constante resltado
    const resultado = turnos
      .filter(filtrarActividad)
      .filter(filtrarDia)
      .filter(filtrarHora)
      .filter(filtrarSucursal);
    //Envio el resultado de nuevo a mostrar en el html
    showHtml(resultado);
  };
  //Funciones que filtran
  function filtrarActividad(turno) {
    //COmpruebo si existe una busqueda por actividad y devuelvo todos los objetos que coinciden
    if (datosBusqueda.Actividad) {
      return turno.Actividad === datosBusqueda.Actividad;
    }
    return turno;
  };
  function filtrarDia(turno) {
    //COmpruebo si existe una busqueda por Dia y devuelvo todos los objetos que coinciden
    if (datosBusqueda.Dia) {
      return turno.Dia === datosBusqueda.Dia;
    }
    return turno;
  };
  function filtrarHora(turno) {
    //COmpruebo si existe una busqueda por Dia y devuelvo todos los objetos que coinciden
    if (datosBusqueda.hora) {
      return turno.hora === datosBusqueda.hora;
    }
    return turno;
  };
  function filtrarSucursal(turno) {
    //COmpruebo si existe una busqueda por Dia y devuelvo todos los objetos que coinciden
    if (datosBusqueda.Sucursal) {
      return turno.Sucursal === datosBusqueda.Sucursal;
    }
    return turno;
  };
  //Funcion que borra los turnos de la base de datos
  function borrarTurno(e){
    //comprobar si tiene la clase eliminar
    if(e.target.classList.contains('eliminar')){
      //confirma el borrado
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: 'Estas seguro de borrar este turno?',
        text: "No podras volver a verlo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, borrar',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Eliminado',
            'El turno ha sido eliminado correctamente!',
          );
          //Se borra del html, y de la base de datos enviando el id
          let borrarHTML = e.target.parentElement.parentElement;
          let idBorrar = e.target.getAttribute("data-id");
          borrarTurnoDataBase(idBorrar, borrarHTML);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
         console.log('Nada.')
        }
      })



    }
  };
  //Funcion que Observar los cambios que van sucediendo en el perfil
  observer();
  function observer() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        displayName = user.displayName;
        email = user.email;
        emailVerified = user.emailVerified;
        photoURL = user.photoURL;
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        providerData = user.providerData;
        //Si el id del user es este, muestra los datos
        if (uid === "6o6osg8MYJfeNC78h7SovdVZg4H3") {
              console.log("Perfil Admin");
            } else {
              //Si no es admin lo saca
              logOut();
            }
      } else {
        logOut();
        console.log("fuera del perfil redireccionando");
      }
    });
  };
  //Funcion logout
  function logOut() {
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
  };
})();

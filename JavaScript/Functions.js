///FUNCIONES COMPARTIDAS PARA TODO EL DOCUMENTO
//Funcion que genera las actividades
export function cargaActivity(activities) {
  for (let i = 0; i < activities.length; i++) {
    let activ = document.querySelector("#activity");
    let opt = document.createElement("option");
    opt.innerHTML = activities[i];
    opt.value = activities[i];
    activ.appendChild(opt);
  }
};
//Funcion que genera los dias
export function cargaDate(dates) {
  for (let i = 0; i < dates.length; i++) {
    let dateSelect = document.querySelector("#date");
    let opt = document.createElement("option");
    opt.innerHTML = dates[i];
    opt.value = dates[i];
    dateSelect.appendChild(opt);
  }
};
//Funcion que genera las horas
export function cargaHour(horario) {
  for (let i = 0; i < horario.length; i++) {
    let hour = document.querySelector("#hour");
    let opt = document.createElement("option");
    opt.innerHTML = horario[i];
    opt.value = horario[i];
    hour.appendChild(opt);
  }
};
//Funcion que genera las sucursales
export function cargaSucursal(sucursales) {
    for (let i = 0; i < sucursales.length; i++) {
      let suc = document.querySelector("#sucursal");
      let opt = document.createElement("option");
      opt.innerHTML = sucursales[i];
      opt.value = sucursales[i];
      suc.appendChild(opt);
    }
};
  

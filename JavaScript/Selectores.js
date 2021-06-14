//ACTIVIDADES DISPONIBLES
export let activities = ["Musculacion"];
//DIAS DISPONIBLES
const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1
const currentDay = new Date(currentYear, currentMonth, 0).getDate();
const date = moment().format('dddd');  
//DIAS DISPONIBLES
export let dates = setDatePicker(currentYear, currentMonth, currentDay, date);
function setDatePicker(currentYear, currentMonth, currentDay, date){
  let result = []
  for( let i = 1; i <= currentDay; i++){
    result = [...result , `${i}/${currentMonth}/${currentYear}`]
  }
  return result;
}
//HORARIOS DISPONIBLES
export let horario = [
  "08:00 hs a 09:00 hs",
  "09:00 hs a 10:00 hs",
  "10:00 hs a 11:00 hs",
  "11:00 hs a 12:00 hs",
  "12:00 hs a 13:00 hs",
  "13:00 hs a 14:00 hs",
  "14:00 hs a 15:00 hs",
  "15:00 hs a 16:00 hs",
  "16:00 hs a 17:00 hs",
  "17:00 hs a 18:00 hs",
  "18:00 hs a 19:00 hs",
  "19:00 hs a 20:00 hs",
];
//SUCURSALES DISPONIBLES
export let sucursales = [
  `Centro`,
];


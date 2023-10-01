export const currentDate=()=>{
    const currentDate = new Date();
    const monthNames = [
     'January', 'February', 'March', 'April', 'May', 'June', 'July',
     'August', 'September', 'October', 'November', 'December'
   ];
const month = monthNames[currentDate.getMonth()];
const day = currentDate.getDate();
const formattedDate = `${month} ${day}`;

return formattedDate
}

export const getCurrentWeekDays=()=> {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
  
    const weekDays:any = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayObj = {
        date: date.getDate(),
        day: getDayOfWeek(date.getDay()),
        year: date.getFullYear(),
        month:date.getMonth(),
        selected: isToday(date)
      };

      function getDayOfWeek(dayIndex) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[dayIndex];
      }

      function isToday(date) {
        const today = new Date();
        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      }
  
      weekDays.push(dayObj);
    }
  
    return weekDays;
  }

export const selectedDate=(date)=>{
    const currentDate = new Date(date);
    const monthNames = [
     'January', 'February', 'March', 'April', 'May', 'June', 'July',
     'August', 'September', 'October', 'November', 'December'
   ];
const month = monthNames[currentDate.getMonth()];
const day = currentDate.getDate();
const formattedDate = `${month} ${day}`;

return formattedDate
}

export const getSelectedWeekDays=(now)=> {
    const today = new Date(now);
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
  
    const weekDays:any = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayObj = {
        date: date.getDate(),
        day: getDayOfWeek(date.getDay()),
        year: date.getFullYear(),
        selected: isToday(date)
      };

      function getDayOfWeek(dayIndex) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[dayIndex];
      }

      function isToday(date) {
        const today = new Date();
        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      }
  
      weekDays.push(dayObj);
    }
  
    return weekDays;
  }
  
export const getTime=(date)=>{
  function formatTimeInGMTPlus3(date) {
    const gmtPlus3Offset = 3 * 60;
    const gmtPlus3Time = new Date(date.getTime() + gmtPlus3Offset * 60 * 1000);
    const hour = gmtPlus3Time.getUTCHours();
    const minute = gmtPlus3Time.getUTCMinutes();
    const formattedHour = (hour % 12 || 12).toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    const period = hour < 12 ? 'AM' : 'PM';
    return `${formattedHour}:${formattedMinute} ${period}`;
  }
  
  const dateFinal = new Date(date);
  const formattedTime = formatTimeInGMTPlus3(dateFinal);
  return formattedTime;
}
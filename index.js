// https://www.youtube.com/watch?v=8Nsb9cjmOVA
const timeDisplay = document.querySelector("#timeDisplay");
const el = document.querySelector("#clock");

const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");
const cla = document.querySelectorAll(".progress-clock__ring-fill")
// console.log(startBtn,cla[2])

let startTime = 0;
let elapsedTime = 0;
let currentTime = 0;
let paused = true;
let intervalId;
let hrs = 0;
let mins = 0;
let secs = 0;

let ringTimeouts = [];
updateTimeout = null

startBtn.addEventListener("click", ()=>{
    if(paused){
        paused = false;
        startTime = Date.now() - elapsedTime; //now method of Date will give u the current time and date in milisec 
        intervalId = setInterval(updateTime, 1000);
    }

});
pauseBtn.addEventListener("click", ()=>{
    if(!paused){
        paused = true;
        elapsedTime = Date.now() - startTime;
        clearInterval(intervalId);
    }
    
});
resetBtn.addEventListener("click", ()=>{
    paused = true;
    console.log(elapsedTime);
    clearInterval(intervalId);
    startTime = 0;
    elapsedTime = 0;
    currentTime = 0;
    hrs = 0;
    mins = 0;
    secs = 0;
       
    const s = el.querySelector(`[data-unit="s"]`);
    const m = el.querySelector(`[data-unit="m"]`);
    const h = el.querySelector(`[data-unit="h"]`);
    s.innerText = "00";
    m.innerText = "00";
    h.innerText = "00";
    cla[2].setAttribute("stroke-dashoffset","666")
    cla[1].setAttribute("stroke-dashoffset","565.5")
    cla[0].setAttribute("stroke-dashoffset","465")
    // console.log("fuck",s,"fuckyoutoo",s) 
    
});

function updateTime(){
    elapsedTime = Date.now() - startTime;


    secs = Math.floor((elapsedTime / 1000) % 60);
    mins = Math.floor((elapsedTime / (1000*60)) % 60);
    hrs = Math.floor((elapsedTime / (1000*3600)) % 60);

    const m_progress = secs / 60;
    const h_progress = (mins + m_progress) / 60;
    const d_progress = (hrs + h_progress) / 24;

    secs = pad(secs);
    mins = pad(mins);
    hrs = pad(hrs);

    const units = [ 
        {
            label: "d", 
            value: "",
            progress: d_progress
        },      
        {
          label: "h", 
          value: hrs,
          progress: h_progress
        },
        {
          label: "m", 
          value: mins,
          progress: m_progress
        },
        {
          label: "s", 
          value: secs
        }
      ];

    //   console.log("prog",secs,m_progress,h_progress,d_progress)

      // flush out the timeouts
    //   ringTimeouts.forEach(t => {
    //     clearTimeout(t);
    //   });
    //   ringTimeouts = [];

    //   console.log("ringTimeouts",ringTimeouts);
       

    function pad(unit){
        return (("0" + unit).length > 2 ? unit : "0"+unit);
    }
  
           // update the display
           units.forEach(u => {
            // rings
            const ring = el.querySelector(`[data-ring="${u.label}"]`);
            // console.log("ring",ring)
    
            if (ring) {
              const strokeDashArray = ring.getAttribute("stroke-dasharray");
              const fill360 = "progress-clock__ring-fill--360";
    
              if (strokeDashArray) {
                // calculate the stroke
                const circumference = +strokeDashArray.split(" ")[0];
                const strokeDashOffsetPct = 1 - u.progress;
    
                ring.setAttribute(
                  "stroke-dashoffset",
                  strokeDashOffsetPct * circumference
                );
    
                // add the fade-out transition, then remove it
                if (strokeDashOffsetPct === 1) {
                  ring.classList.add(fill360);
    
                  ringTimeouts.push(
                    setTimeout(() => {
                      ring.classList.remove(fill360);
                    }, 600)
                  );
                }
              }
            }
            
    
            // digits
            const unit = el.querySelector(`[data-unit="${u.label}"]`);
    
            if (unit)
              unit.innerText = u.value;
          });
         
    
}
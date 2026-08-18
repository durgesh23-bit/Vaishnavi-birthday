const DEV_MODE=false,PASSWORD="0703",BIRTHDAY=new Date(2026,9,7),$=id=>document.getElementById(id);
const audio=$("audio");
let musicStarted=false;
function startMusic(){
  audio.volume=0.9;
  audio.load();
  const promise=audio.play();
  if(promise && promise.then){
    promise.then(()=>{musicStarted=true; const m=$("music"); if(m)m.textContent="♫";}).catch(()=>{});
  }
}
$("form").addEventListener("submit",e=>{
 e.preventDefault();
 if($("pin").value===PASSWORD){
   startMusic();
   $("lock").classList.add("hidden");$("site").classList.remove("hidden");init();
 }else{$("error").textContent="Almost… try our little secret again ♡";$('+'"pin"'+').animate([{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"translateX(0)"}],{duration:350})}
});
function init(){calendar();count();setInterval(count,1000);if(DEV_MODE||new Date()>=BIRTHDAY)setTimeout(()=>$("birthday").classList.remove("hidden"),1200);document.querySelectorAll(".photo-grid img").forEach(im=>{im.onerror=()=>im.src=placeholder(im.alt);im.onclick=()=>{if(!im.src.startsWith("data:")){$("light").src=im.src;$("lightbox").classList.remove("hidden")}}})}
function count(){let x=BIRTHDAY-new Date();if(x<0)x=0;$("days").textContent=Math.floor(x/864e5).toString().padStart(2,"0");$("hours").textContent=Math.floor(x/36e5)%24 .toString().padStart(2,"0");$("mins").textContent=Math.floor(x/6e4)%60 .toString().padStart(2,"0");$("secs").textContent=Math.floor(x/1e3)%60 .toString().padStart(2,"0")}
function calendar(){let c=$("calendar"),first=new Date(2026,9,1).getDay(),now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());c.innerHTML=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(x=>`<div class="day-name">${x}</div>`).join("");for(let i=0;i<first;i++)c.innerHTML+="<div></div>";for(let d=1;d<=31;d++){let date=new Date(2026,9,d),past=date<today,todayx=date.toDateString()===today.toDateString();c.innerHTML+=`<div class="day ${past?"past":""} ${todayx?"today":""} ${d===7?"birthday":""}">${d}</div>`}}
$("enter").onclick=()=>{$("birthday").classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"})};$("close").onclick=()=>$("lightbox").classList.add("hidden");$("lightbox").onclick=e=>{if(e.target===$("lightbox"))$("lightbox").classList.add("hidden")};
const audio=$("audio"), musicBtn=$("music");
audio.addEventListener("play",()=>{musicBtn.textContent="❚❚";musicBtn.title="Pause music"});
audio.addEventListener("pause",()=>{musicBtn.textContent="♫";musicBtn.title="Play music"});
audio.addEventListener("error",()=>{musicBtn.textContent="!";musicBtn.title="Audio could not be loaded";});
musicBtn.addEventListener("click",async()=>{try{if(audio.paused){await audio.play()}else{audio.pause()}}catch(err){console.error("Audio playback failed:",err);musicBtn.textContent="!";}});
function placeholder(t){let s=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700"><rect width="100%" height="100%" fill="#3a1d27"/><text x="50%" y="48%" text-anchor="middle" fill="#e8aeba" font-size="42" font-family="Georgia">${t}</text><text x="50%" y="57%" text-anchor="middle" fill="#b8959c" font-size="20">Replace with your photo ♡</text></svg>`;return"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s)}
$("music").onclick=()=>{if(audio.paused){startMusic()}else{audio.pause();$("music").textContent="♫"}};
audio.addEventListener("error",()=>{$("music").title="Audio could not be loaded. Check that audio/birthday-song.mp3 is uploaded to GitHub."});

// Romantic birthday website for Vaishnavi
// Set DEV_MODE to true while developing to preview the birthday page before October 7.
const DEV_MODE = false;

const PASSWORD = "0703";
const BIRTHDAY = new Date(2026, 9, 7, 0, 0, 0); // October 7, 2026
const FIRST_MEETING = "28 April";

const $ = (id) => document.getElementById(id);

const lockScreen = $("lockScreen");
const countdownPage = $("countdownPage");
const birthdayPage = $("birthdayPage");
const birthdayLocked = $("birthdayLocked");
const passwordForm = $("passwordForm");
const passwordInput = $("password");
const passwordError = $("passwordError");
const birthdayReveal = $("birthdayReveal");
const birthdayContent = $("birthdayContent");
const enterBirthday = $("enterBirthday");
const musicButton = $("musicButton");
const birthdaySong = $("birthdaySong");

let unlocked = false;

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordInput.value === PASSWORD) {
    unlocked = true;
    passwordError.textContent = "";
    lockScreen.classList.add("hidden");
    countdownPage.classList.remove("hidden");
    updateAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    passwordError.textContent = "Hmm... that's not our secret ❤️ Try again.";
    passwordForm.classList.remove("shake");
    void passwordForm.offsetWidth;
    passwordForm.classList.add("shake");
    passwordInput.select();
  }
});

function now() {
  return new Date();
}

function isBirthdayAvailable() {
  return DEV_MODE || now() >= BIRTHDAY;
}

function updateCountdown() {
  const current = now();
  let diff = BIRTHDAY - current;

  if (diff <= 0) {
    $("daysRemaining").textContent = "❤️";
    $("countdownLabel").textContent = "IT'S YOUR DAY";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $("daysRemaining").textContent = days;
  $("countdownLabel").textContent = days === 1 ? "DAY TO GO ❤️" : "DAYS TO GO ❤️";
  $("hours").textContent = String(hours).padStart(2, "0");
  $("minutes").textContent = String(minutes).padStart(2, "0");
  $("seconds").textContent = String(seconds).padStart(2, "0");
}

function buildCalendar() {
  const calendar = $("calendar");
  const year = BIRTHDAY.getFullYear();
  const month = BIRTHDAY.getMonth();

  // Show the birthday month.
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const current = now();

  calendar.innerHTML = `
    <div class="calendar-title">
      <h4>October 2026</h4>
      <span>07 October ❤️</span>
    </div>
    <div class="calendar-grid">
      ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => `<div class="day-name">${d}</div>`).join("")}
      ${Array.from({length: firstDay}, () => `<div class="day empty"></div>`).join("")}
      ${Array.from({length: daysInMonth}, (_, i) => {
        const day = i + 1;
        const date = new Date(year, month, day);
        const sameDay = date.toDateString() === current.toDateString();
        const birthday = day === 7;
        const past = date < new Date(current.getFullYear(), current.getMonth(), current.getDate());
        return `<div class="day ${past ? "past" : ""} ${sameDay ? "today" : ""} ${birthday ? "birthday" : ""}">
          ${day}${birthday ? " ❤️" : ""}
        </div>`;
      }).join("")}
    </div>
  `;
}

function updateBirthdayGate() {
  if (isBirthdayAvailable()) {
    birthdayLocked.classList.add("hidden");
  } else {
    birthdayLocked.classList.remove("hidden");
  }
}

function showBirthdayPage() {
  if (!isBirthdayAvailable()) return;

  countdownPage.classList.add("hidden");
  birthdayPage.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

enterBirthday.addEventListener("click", () => {
  birthdayReveal.classList.add("hidden");
  birthdayContent.classList.remove("hidden");
  createHearts(18);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

birthdayLocked.addEventListener("click", () => {
  if (isBirthdayAvailable()) showBirthdayPage();
});

function updateAll() {
  updateCountdown();
  buildCalendar();
  updateBirthdayGate();

  // On the birthday, the reveal is available.
  if (isBirthdayAvailable() && unlocked) {
    birthdayLocked.classList.add("hidden");
    // Keep the countdown visible until the user reaches the birthday section.
    // The button below the countdown becomes available on the birthday.
    if (!document.getElementById("birthdayOpenButton")) {
      const btn = document.createElement("button");
      btn.id = "birthdayOpenButton";
      btn.textContent = "Open Your Birthday Surprise ✨";
      btn.style.display = "block";
      btn.style.margin = "25px auto 0";
      btn.addEventListener("click", showBirthdayPage);
      birthdayLocked.parentElement.appendChild(btn);
    }
  }
}

setInterval(updateAll, 1000);

musicButton.addEventListener("click", async () => {
  try {
    if (birthdaySong.paused) {
      await birthdaySong.play();
      musicButton.textContent = "♫ Pause Our Song";
    } else {
      birthdaySong.pause();
      musicButton.textContent = "♫ Play Our Song";
    }
  } catch {
    musicButton.textContent = "♫ Add birthday-song.mp3";
  }
});

birthdaySong.addEventListener("ended", () => {
  musicButton.textContent = "♫ Play Our Song";
});
birthdaySong.addEventListener("error", () => {
  musicButton.title = "Place your song at audio/birthday-song.mp3";
});

// Graceful image placeholders.
document.querySelectorAll(".gallery img").forEach((img) => {
  img.addEventListener("error", () => {
    const label = img.alt || "Memory";
    img.src = makePlaceholder(label);
    img.style.cursor = "default";
  });
});

function makePlaceholder(text) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700">
    <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#32101f"/><stop offset="1" stop-color="#7b3153"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="48%" fill="#ffd9e7" text-anchor="middle" font-family="Georgia" font-size="48">${text}</text>
    <text x="50%" y="58%" fill="#ff9fc4" text-anchor="middle" font-family="Arial" font-size="26">Add your photo here ❤️</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// Lightbox.
const lightbox = $("lightbox");
const lightboxImage = $("lightboxImage");

document.querySelectorAll(".gallery img").forEach((img) => {
  img.addEventListener("click", () => {
    if (img.src.startsWith("data:image")) return;
    lightboxImage.src = img.src;
    lightbox.classList.remove("hidden");
  });
});

$("closeLightbox").addEventListener("click", () => lightbox.classList.add("hidden"));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.add("hidden");
});

// Floating hearts.
function createHearts(count = 6) {
  const container = $("hearts");
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > .5 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 25}px`;
    heart.style.animationDuration = `${7 + Math.random() * 8}s`;
    heart.style.animationDelay = `${Math.random() * 3}s`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 16000);
  }
}
setInterval(() => createHearts(2), 1800);
createHearts(8);

// Allow keyboard shortcut only in development mode.
// No production bypass is provided.
document.addEventListener("keydown", (event) => {
  if (DEV_MODE && event.key.toLowerCase() === "b") {
    showBirthdayPage();
  }
});

updateAll();

// Floating Hearts
function createHeart(){
  const heart=document.createElement("div");
  heart.className="heart"; heart.innerText="❤️";
  heart.style.left=Math.random()*100+"vw";
  heart.style.fontSize=(16+Math.random()*24)+"px";
  document.querySelector(".hearts").appendChild(heart);
  setTimeout(()=>heart.remove(),6000);
}
setInterval(createHeart,600);

// Timeline animation
window.addEventListener("scroll",()=>{
  document.querySelectorAll(".event").forEach(ev=>{
    const pos=ev.getBoundingClientRect().top;
    if(pos<window.innerHeight-50) ev.classList.add("show");
  });
});

// Gallery Lightbox
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
document.querySelectorAll(".gallery img").forEach(img=>
  img.onclick=()=>{lightbox.style.display="flex";lightboxImg.src=img.src;}
);
lightbox.onclick=()=>lightbox.style.display="none";

// Love Wheel 🎡
// Love Wheel 🎡
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const slices = ["elo elo😁","💖 Hug","One Sweet Hug 🤗","🍿 Movie","🍽 Dinner","☕ Coffee","🎁 Gift","Forehead Kiss😗"];

let startAngle = 0;
let spinning = false;
let spinAngle = 0;

// Draw the wheel
function drawWheel() {
  const sliceCount = slices.length;
  const arc = (2 * Math.PI) / sliceCount;

  // Clear canvas before each redraw
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < sliceCount; i++) {
    const angle = startAngle + i * arc;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(200, 200); // canvas center
    ctx.arc(200, 200, 200, angle, angle + arc);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? "#ffb3e6" : "#ffe6f7";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    // Draw text centered inside slice
    ctx.save();
    ctx.translate(200, 200);             // move origin to center
    ctx.rotate(angle + arc / 2);         // rotate to the middle of slice
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.font = "18px Arial";
    ctx.fillText(slices[i], 100, 5);     // text radius
    ctx.restore();
  }

  // Draw pointer triangle at top
  ctx.beginPath();
  ctx.moveTo(200, 10);
  ctx.lineTo(190, 40);
  ctx.lineTo(210, 40);
  ctx.closePath();
  ctx.fillStyle = "#ff3366";
  ctx.fill();
}

// Spin logic
document.getElementById("spinBtn").addEventListener("click", () => {
  if (spinning) return;
  spinning = true;

  // Spin distance between 20–30 rotations
  let spinTime = 0;
  const spinTimeTotal = 3000 + Math.random() * 2000; // 3–5 sec spin

  function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
      stopRotateWheel();
      return;
    }

    // Gradually slow down
    const spinAngleChange = (Math.random() * 15 + 10) * (spinTimeTotal - spinTime) / spinTimeTotal;
    startAngle += (spinAngleChange * Math.PI) / 180;
    drawWheel();
    requestAnimationFrame(rotateWheel);
  }

  function stopRotateWheel() {
    spinning = false;
    const sliceCount = slices.length;
    const arc = (2 * Math.PI) / sliceCount;
    const degrees = startAngle * 180 / Math.PI + 90;
    const index = Math.floor((sliceCount - (degrees % 360) / (360 / sliceCount)) % sliceCount);

    document.getElementById("result").innerText = "You won: " + slices[index] + " 🎉";
  }

  rotateWheel();
});

// Initial draw
drawWheel();

// 🎼 Spotify-style Playlist
const songs = document.querySelectorAll("#songList li");
const audio = document.getElementById("audio"),
      title = document.getElementById("title"),
      artist = document.getElementById("artist"),
      cover = document.getElementById("cover"),
      playBtn = document.getElementById("play"),
      prevBtn = document.getElementById("prev"),
      nextBtn = document.getElementById("next"),
      progress = document.getElementById("progress"),
      currTime = document.getElementById("currentTime"),
      duration = document.getElementById("duration");

let songIndex = 0;
let isPlaying = false;

// Load a song
function loadSong(i) {
  let s = songs[i];
  songs.forEach(l => l.classList.remove("active"));
  s.classList.add("active");
  audio.src = s.dataset.src;
  title.innerText = s.dataset.title;
  artist.innerText = s.dataset.artist;
  cover.src = s.dataset.cover;
}

// Controls
function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerText = "⏸";
}
function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerText = "▶️";
}
playBtn.onclick = () => isPlaying ? pauseSong() : playSong();

prevBtn.onclick = () => { songIndex = (songIndex-1+songs.length)%songs.length; loadSong(songIndex); playSong(); }
nextBtn.onclick = () => { songIndex = (songIndex+1)%songs.length; loadSong(songIndex); playSong(); }

// Playlist click
songs.forEach((s,i)=>s.onclick=()=>{songIndex=i; loadSong(i); playSong();});

// Progress bar and time
audio.ontimeupdate = () => {
  if (audio.duration) {
    progress.max = audio.duration;
    progress.value = audio.currentTime;

    currTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
  }
};
progress.oninput = () => { audio.currentTime = progress.value; };
audio.onended = () => nextBtn.click();

function formatTime(sec) {
  const minutes = Math.floor(sec/60);
  const seconds = Math.floor(sec%60).toString().padStart(2,'0');
  return `${minutes}:${seconds}`;
}

// Load first song
loadSong(songIndex);
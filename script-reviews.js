// === FIREBASE CONFIG (same as before) ===
const firebaseConfig = {
  apiKey: "AIzaSyCGn9V5dUPM3m_LxzQuiwDWB5vUc24bF6c",
  authDomain: "andz-reviews-67306.firebaseapp.com",
  databaseURL: "https://andz-reviews-67306-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "andz-reviews-67306",
  storageBucket: "andz-reviews-67306.firebasestorage.app",
  messagingSenderId: "314000134063",
  appId: "1:314000134063:web:850f55c638f8ef34e7695a"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const form = document.getElementById("review-form");
const messageInput = document.getElementById("message");
const wordCount = document.getElementById("word-count");
const reviewsContainer = document.getElementById("reviews-container");
const noReviews = document.getElementById("no-reviews");

const avgNumber = document.getElementById("avg-number");
const avgStars = document.getElementById("avg-stars");
const totalReviews = document.getElementById("total-reviews");
const lastUpdated = document.getElementById("last-updated");

const sortBtns = document.querySelectorAll(".sort-btn");
// === STARS RATING HANDLER ===
const stars = document.querySelectorAll("#rating-stars span");
const hiddenRating = document.getElementById("rating");

stars.forEach(star => {
  star.addEventListener("click", () => {
    const value = parseInt(star.dataset.value);
    hiddenRating.value = value;

    stars.forEach(s => s.classList.toggle("active", parseInt(s.dataset.value) <= value));
  });
});
let currentSort = "recent";

// === Helper functions ===
function buildStars(n){return "★".repeat(n)+"☆".repeat(5-n);}
function trimWords(t){let w=t.split(/\s+/);return w.slice(0,100).join(" ");}
function formatDate(ts){let d=new Date(ts);return d.toLocaleDateString()+" "+d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});}

// === Word limit live ===
messageInput.addEventListener("input",()=>{
  let count=messageInput.value.trim().split(/\s+/).filter(Boolean).length;
  if(count>100){
    messageInput.value=trimWords(messageInput.value);
    count=100;
  }
  wordCount.textContent=`${count} / 100 words`;
});

// === Submit ===
form.addEventListener("submit",e=>{
  e.preventDefault();
  const name=form.name.value.trim()||"Anonymous";
  const gender=form.gender.value;
  const rating=parseInt(getRating());
  let msg=trimWords(form.message.value.trim());
  if(!msg)return alert("Write a short message (max 100 words).");
  const now=new Date().toISOString();
  db.ref("reviews").push({name,gender,rating,message:msg,ts:now});
  form.reset();wordCount.textContent="0 / 100 words";
  alert("✅ Review sent!");
});

// === Load & display ===
let cache=[];
function load(){
  db.ref("reviews").on("value",snap=>{
    cache=[];
    snap.forEach(c=>cache.push({key:c.key,...c.val()}));
    render();
  });
}
function render(){
  let data=[...cache];
  if(currentSort==="recent")data.sort((a,b)=>new Date(b.ts)-new Date(a.ts));
  if(currentSort==="oldest")data.sort((a,b)=>new Date(a.ts)-new Date(b.ts));
  if(currentSort==="highest")data.sort((a,b)=>b.rating-a.rating);
  if(currentSort==="lowest")data.sort((a,b)=>a.rating-b.rating);
  reviewsContainer.innerHTML="";
  if(!data.length){noReviews.style.display="block";return;}else noReviews.style.display="none";
  const avg=(data.reduce((a,b)=>a+b.rating,0)/data.length).toFixed(2);
  avgNumber.textContent=avg;avgStars.textContent=buildStars(Math.round(avg));
  totalReviews.textContent=data.length;
  lastUpdated.textContent=formatDate(data[data.length-1].ts);
  data.forEach(r=>{
    const div=document.createElement("div");div.className="review-item";div.title=formatDate(r.ts);
    const avatar=document.createElement("div");avatar.className="review-avatar";
    const img=document.createElement("img");img.src=r.gender==="female"?"assets/logos/female.png":"assets/logos/male.png";avatar.appendChild(img);
    const content=document.createElement("div");content.className="review-content";
    const header=document.createElement("div");header.className="review-header";
    const uname=document.createElement("div");uname.className="user-name";uname.textContent=r.name;
    const ustars=document.createElement("div");ustars.className="user-stars";ustars.textContent=buildStars(r.rating)+" ("+r.rating+")";
    header.appendChild(uname);header.appendChild(ustars);
    const msg=document.createElement("div");msg.className="review-message";msg.textContent=r.message;
    content.appendChild(header);content.appendChild(msg);
    div.appendChild(avatar);div.appendChild(content);
    reviewsContainer.appendChild(div);
  });
}

// === Sort buttons ===
sortBtns.forEach(b=>{
  b.addEventListener("click",()=>{
    sortBtns.forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    currentSort=b.dataset.sort;
    render();
  });
});

window.addEventListener("load",load);

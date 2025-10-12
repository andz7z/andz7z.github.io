// === Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyCGn9V5dUPM3m_LxzQuiwDWB5vUc24bF6c",
  authDomain: "andz-reviews-67306.firebaseapp.com",
  databaseURL: "https://andz-reviews-67306-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "andz-reviews-67306",
  storageBucket: "andz-reviews-67306.appspot.com",
  messagingSenderId: "314000134063",
  appId: "1:314000134063:web:850f55c638f8ef34e7695a"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const AVATAR = { male: 'assets/logos/male.png', female: 'assets/logos/female.png' };
const EMOJI = { web: '🌐', editing: '🎬', programming: '💻' };

const form = document.getElementById('review-form');
const nameIn = document.getElementById('name');
const messageIn = document.getElementById('message');
const serviceIn = document.getElementById('service');
const genderIn = form.gender;
const charCount = document.getElementById('char-count');
const stars = document.querySelectorAll('#rating-stars span');

let selectedRating = 0;
function updateStars(value){
  selectedRating = value;
  stars.forEach(s => {
    const v = Number(s.dataset.value);
    s.classList.toggle('active', v <= value);
  });
}
stars.forEach(s => s.addEventListener('click', () => updateStars(Number(s.dataset.value))));

messageIn.addEventListener('input',()=>{
  const left=100-messageIn.value.length;
  charCount.textContent=`(${left})`;
});

// submit
form.addEventListener('submit', async e=>{
  e.preventDefault();
  const name=nameIn.value.trim();
  const message=messageIn.value.trim();
  const service=serviceIn.value;
  const gender=form.gender.value;
  const rating=selectedRating;
  if(!name||!message||!rating) return alert('Complete all fields!');
  const ref=db.ref('reviews').push();
  await ref.set({ name, message, service, gender, rating, ts: Date.now() });
  form.reset();
  updateStars(0);
  charCount.textContent='(100)';
});

// render
const list=document.getElementById('reviews-list');
const pagination=document.getElementById('pagination');
const sortSelect=document.getElementById('sort-reviews');
const filterSelect=document.getElementById('filter-service');
const donutCanvas=document.getElementById('rating-donut');
let reviews=[],currentPage=1,PAGE_SIZE=10,currentSort='recent',currentFilter='all';
let chart;

db.ref('reviews').on('value',snap=>{
  const arr=[];
  snap.forEach(c=>arr.push({id:c.key,...c.val()}));
  reviews=arr;
  renderReviews();
});

function sortReviews(list,mode){
  if(mode==='recent') return list.sort((a,b)=>b.ts-a.ts);
  if(mode==='oldest') return list.sort((a,b)=>a.ts-b.ts);
  if(mode==='highest') return list.sort((a,b)=>b.rating-a.rating);
  if(mode==='lowest') return list.sort((a,b)=>a.rating-b.rating);
  return list;
}
function filterReviews(list,service){
  if(service==='all') return list;
  return list.filter(r=>r.service===service);
}
function paginate(list,page){
  const start=(page-1)*PAGE_SIZE;
  return list.slice(start,start+PAGE_SIZE);
}
function renderReviews(){
  const filtered=filterReviews(reviews,currentFilter);
  const sorted=sortReviews(filtered,currentSort);
  const total=sorted.length;
  if(total===0){
    list.innerHTML='<p style="text-align:center;opacity:.7">No reviews yet.</p>';
    drawDonut(0);
    return;
  }
  const avg=sorted.reduce((s,r)=>s+r.rating,0)/total;
  drawDonut(avg);

  const pages=Math.ceil(total/PAGE_SIZE);
  if(currentPage>pages) currentPage=pages;
  const pageData=paginate(sorted,currentPage);

  list.innerHTML='';
  for(const r of pageData){
    const card=document.createElement('div');
    card.className='review-card';
    card.setAttribute('data-datetime',new Date(r.ts).toLocaleString());
    card.innerHTML=`
      <img class="review-avatar" src="${AVATAR[r.gender]||AVATAR.male}" alt="">
      <div>
        <div class="review-name">${r.name} ${r.gender==='female'?'♀️':'♂️'} <span class="review-stars">${'★'.repeat(r.rating)}</span></div>
        <div class="review-text">${r.message}</div>
        <div class="review-service">${EMOJI[r.service]} ${r.service}</div>
      </div>
    `;
    list.appendChild(card);
  }

  pagination.innerHTML='';
  if(pages>1){
    for(let i=1;i<=pages;i++){
      const b=document.createElement('button');
      b.textContent=i;
      if(i===currentPage) b.classList.add('active');
      b.onclick=()=>{currentPage=i;renderReviews();};
      pagination.appendChild(b);
    }
  }
}

sortSelect.addEventListener('change',()=>{currentSort=sortSelect.value;renderReviews();});
filterSelect.addEventListener('change',()=>{currentFilter=filterSelect.value;renderReviews();});

// donut chart
function drawDonut(avg){
  if(chart) chart.destroy();
  const ctx=donutCanvas.getContext('2d');
  chart=new Chart(ctx,{
    type:'doughnut',
    data:{
      datasets:[{
        data:[avg,5-avg],
        backgroundColor:['#ffd95a','rgba(255,255,255,0.1)'],
        borderWidth:0
      }]
    },
    options:{
      cutout:'70%',
      plugins:{legend:{display:false},tooltip:{enabled:false}}
    }
  });
}

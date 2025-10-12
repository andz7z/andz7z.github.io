// === FIREBASE CONFIG ===
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

// refs
const form = document.getElementById('review-form');
const nameIn = document.getElementById('name');
const ratingInput = document.getElementById('rating');
const messageIn = document.getElementById('message');
const serviceIn = document.getElementById('service');
const genderIn = form.gender;
const starBtns = document.querySelectorAll('.star');
const charCount = document.getElementById('char-count');

const reviewsList = document.getElementById('reviews-list');
const avgVal = document.getElementById('avg-value');
const totalCount = document.getElementById('total-count');
const sortSelect = document.getElementById('sort-select');
const serviceFilter = document.getElementById('service-filter');
const pagination = document.getElementById('pagination');
const donutCanvas = document.getElementById('rating-donut');

const AVATAR = { male: 'assets/logos/male.png', female: 'assets/logos/female.png' };
const SERVICE_EMOJI = { web: '🌐', editing: '🎬', programming: '💻' };

let reviews = [];
let currentPage = 1, currentSort = 'recent', currentService = 'all';
const PAGE_SIZE = 10;

// star rating
let currentStars = 5;
function updateStars(v){
  currentStars = v;
  ratingInput.value = v;
  starBtns.forEach(btn=>{
    const val = Number(btn.dataset.value);
    btn.classList.toggle('active', val <= v);
  });
}
starBtns.forEach(btn=>{
  btn.addEventListener('click',()=>updateStars(Number(btn.dataset.value)));
});
updateStars(5);

// char count
messageIn.addEventListener('input',()=>{
  const left = 100 - messageIn.value.length;
  charCount.textContent = (${left});
});

// submit
form.addEventListener('submit', async e=>{
  e.preventDefault();
  const name = nameIn.value.trim();
  const rating = Number(ratingInput.value);
  const message = messageIn.value.trim();
  const gender = form.gender.value;
  const service = serviceIn.value;

  if(!name  !rating  !message) return alert('Fill all fields!');
  if(message.length>100) return alert('Max 100 characters!');

  const ref = db.ref('reviews').push();
  await ref.set({
    name, rating, message, gender, service,
    ts: Date.now(),
    approved: false // ✅ admin approves manually in Firebase
  });
  form.reset();
  updateStars(5);
  charCount.textContent = '(100)';
  showNote('✅ Sent! Waiting for approval.');
});

function showNote(t){
  const el = document.createElement('div');
  el.textContent = t;
  el.style.position='fixed';el.style.bottom='15px';el.style.right='15px';
  el.style.background='rgba(255,255,255,0.9)';
  el.style.padding='10px 14px';el.style.borderRadius='10px';
  el.style.color='#000';el.style.fontWeight='600';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),2000);
}

// read data
db.ref('reviews').on('value',snap=>{
  const arr=[];
  snap.forEach(c=>{
    const v=c.val();
    if(v.approved) arr.push({id:c.key,...v});
  });
  reviews=arr;
  renderReviews();
});

function sortReviews(list,mode){
  const arr=[...list];
  if(mode==='recent') return arr.sort((a,b)=>b.ts-a.ts);
  if(mode==='oldest') return arr.sort((a,b)=>a.ts-b.ts);
  if(mode==='highest') return arr.sort((a,b)=>b.rating-a.rating);
  if(mode==='lowest') return arr.sort((a,b)=>a.rating-b.rating);
  return arr;
}

function filterByService(list,service){
  if(service==='all') return list;
  return list.filter(r=>r.service===service);
}

function paginate(list,page){
  const start=(page-1)*PAGE_SIZE;
  return list.slice(start,start+PAGE_SIZE);
}

function renderReviews(){
  const filtered=filterByService(reviews,currentService);
  const sorted=sortReviews(filtered,currentSort);
  const total=sorted.length;
  totalCount.textContent=total;

  if(total===0){
    reviewsList.innerHTML='<p id="no-reviews" class="muted">No approved reviews found.</p>';
    drawDonut(0);
    avgVal.textContent='0.0';
    pagination.innerHTML='';
    return;
  }

  const avg=sorted.reduce((s,r)=>s+r.rating,0)/total;
  avgVal.textContent=avg.toFixed(1);
  drawDonut(avg);

  const pages=Math.ceil(total/PAGE_SIZE);
  if(currentPage>pages) currentPage=pages;
  const pageData=paginate(sorted,currentPage);

  reviewsList.innerHTML='';
  for(const r of pageData){
    const card=document.createElement('div');
    card.className='review-card';
    card.setAttribute('data-datetime',new Date(r.ts).toLocaleString());

    const avatar=document.createElement('img');
    avatar.className='review-avatar';
    avatar.src=AVATAR[r.gender]||AVATAR.male;

    const meta=document.createElement('div');
    meta.className='review-meta';
    meta.innerHTML=`
      <div class="review-top">
        <div class="review-name">${r.name} ${r.gender==='female'?'♀️':'♂️'}</div>
        <div class="review-stars">${'★'.repeat(r.rating)}</div>
      </div>
      <div class="review-service">${SERVICE_EMOJI[r.service]} ${r.service}</div>
      <div class="review-text">${r.message}</div>
    `;
    card.appendChild(avatar);
    card.appendChild(meta);
    reviewsList.appendChild(card);
  }

  // pagination
  pagination.innerHTML='';
  if(pages>1){
    for(let i=1;i<=pages;i++){
      const btn=document.createElement('button');
      btn.className='page-btn'+(i===currentPage?' active':'');
      btn.textContent=i;
      btn.onclick=()=>{currentPage=i;renderReviews();};
      pagination.appendChild(btn);
    }
  }
}

// filters & sorting
sortSelect.addEventListener('change',()=>{currentSort=sortSelect.value;currentPage=1;renderReviews();});
serviceFilter.addEventListener('change',()=>{currentService=serviceFilter.value;currentPage=1;renderReviews();});

// donut chart
let donutChart;
function drawDonut(avg){
  if(!donutCanvas) return;
  const ctx=donutCanvas.getContext('2d');
  if(donutChart) donutChart.destroy();
  const data=[avg,5-avg];
  donutChart=new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Average','Remaining'],
      datasets:[{
        data,
        backgroundColor:['#FFD95A','rgba(255,255,255,0.1)'],
        borderWidth:0,
      }]
    },
    options:{
      cutout:'70%',
      plugins:{legend:{display:false},tooltip:{enabled:false}},
    }
  });
}

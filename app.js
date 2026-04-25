const USERS=[
  {email:'demo@spendiq.io',pass:'demo1234',name:'Arjun Kumar',team:'Goa Sprint Q2',init:'AK'},
  {email:'priya@team.com',pass:'pass1234',name:'Priya Mehta',team:'Goa Sprint Q2',init:'PM'}
];
let currentUser=null;
const MEMBERS=[
  {name:'Arjun',color:'#6c63ff',bg:'rgba(108,99,255,0.14)',init:'AK'},
  {name:'Priya',color:'#ff4d8d',bg:'rgba(255,77,141,0.12)',init:'PM'},
  {name:'Riya',color:'#00d4aa',bg:'rgba(0,212,170,0.12)',init:'RS'},
  {name:'Dev',color:'#ffa94d',bg:'rgba(255,169,77,0.12)',init:'DP'},
  {name:'Neha',color:'#4da6ff',bg:'rgba(77,166,255,0.12)',init:'NR'},
];
const CATS=[
  {name:'Software',icon:'💻',color:'#6c63ff',limit:400000},
  {name:'Travel',icon:'✈️',color:'#ff4d8d',limit:300000},
  {name:'Marketing',icon:'📢',color:'#00d4aa',limit:350000},
  {name:'Office',icon:'🏢',color:'#ffa94d',limit:150000},
  {name:'Training',icon:'📚',color:'#4da6ff',limit:120000},
  {name:'Food',icon:'🍕',color:'#f43f5e',limit:80000},
];
let budget=1500000;
let expenses=[
  {id:1,desc:'AWS Infrastructure',cat:'Software',amt:84000,date:'2026-04-22',by:'Arjun',split:'all',status:'approved'},
  {id:2,desc:'Delhi Client Trip',cat:'Travel',amt:52000,date:'2026-04-20',by:'Priya',split:'all',status:'approved'},
  {id:3,desc:'Google Ads Q2',cat:'Marketing',amt:120000,date:'2026-04-18',by:'Dev',split:'all',status:'approved'},
  {id:4,desc:'Figma Team Plan',cat:'Software',amt:28400,date:'2026-04-17',by:'Riya',split:'2',status:'approved'},
  {id:5,desc:'Mumbai Conference',cat:'Travel',amt:78000,date:'2026-04-15',by:'Arjun',split:'3',status:'review'},
  {id:6,desc:'Office Supplies',cat:'Office',amt:14200,date:'2026-04-12',by:'Neha',split:'all',status:'approved'},
  {id:7,desc:'LinkedIn Recruiter',cat:'Software',amt:64000,date:'2026-04-10',by:'Priya',split:'2',status:'pending'},
  {id:8,desc:'Coursera Licenses',cat:'Training',amt:32000,date:'2026-04-08',by:'Dev',split:'all',status:'approved'},
  {id:9,desc:'Team Lunch',cat:'Food',amt:8500,date:'2026-04-06',by:'Riya',split:'all',status:'approved'},
  {id:10,desc:'Slack Business',cat:'Software',amt:21600,date:'2026-04-02',by:'Arjun',split:'all',status:'pending'},
  {id:11,desc:'Design Workshop',cat:'Training',amt:45000,date:'2026-03-28',by:'Priya',split:'3',status:'approved'},
  {id:12,desc:'Bangalore Trip',cat:'Travel',amt:95000,date:'2026-03-25',by:'Dev',split:'all',status:'approved'},
];
let settledTxns=new Set();
let selCat='Software';
let donutChart=null,trendChart=null,mBarChart=null,cPieChart=null,aChart=null;

function fmt(n){return'₹'+Math.round(n).toLocaleString('en-IN')}
function fmtL(n){return n>=100000?'₹'+(n/100000).toFixed(1)+'L':n>=1000?'₹'+(n/1000).toFixed(0)+'K':'₹'+n}
function totalSpent(){return expenses.reduce((s,e)=>s+e.amt,0)}
function catSpent(name){return expenses.filter(e=>e.cat===name).reduce((s,e)=>s+e.amt,0)}
function memSpent(name){return expenses.filter(e=>e.by===name).reduce((s,e)=>s+e.amt,0)}

function switchAuthTab(tab){
  document.getElementById('loginTab').classList.toggle('active',tab==='login');
  document.getElementById('signupTab').classList.toggle('active',tab==='signup');
  document.getElementById('loginForm').style.display=tab==='login'?'block':'none';
  document.getElementById('signupForm').style.display=tab==='signup'?'block':'none';
}
function showErr(id,msg){const el=document.getElementById(id);el.textContent=msg;el.style.display='block';setTimeout(()=>el.style.display='none',4000);}
function checkStrength(v){
  const fill=document.getElementById('strengthFill'),lbl=document.getElementById('strengthLabel');
  if(!v){fill.style.width='0';lbl.textContent='';return}
  let s=0;if(v.length>=8)s++;if(/[A-Z]/.test(v))s++;if(/[0-9]/.test(v))s++;if(/[^a-zA-Z0-9]/.test(v))s++;
  const map={1:{w:'25%',c:'#f43f5e',t:'Weak'},2:{w:'50%',c:'#ffa94d',t:'Fair'},3:{w:'75%',c:'#4da6ff',t:'Good'},4:{w:'100%',c:'#00d4aa',t:'Strong'}};
  const m=map[Math.max(1,s)];fill.style.width=m.w;fill.style.background=m.c;lbl.textContent=m.t;lbl.style.color=m.c;
}
function doLogin(){
  const email=document.getElementById('lEmail').value.trim(),pass=document.getElementById('lPass').value;
  if(!email||!pass){showErr('loginErr','Please fill in all fields');return}
  const u=USERS.find(u=>u.email===email&&u.pass===pass);
  if(!u){showErr('loginErr','Invalid email or password. Try demo@spendiq.io / demo1234');return}
  loginSuccess(u);
}
function doSignup(){
  const first=document.getElementById('sFirst').value.trim(),last=document.getElementById('sLast').value.trim();
  const email=document.getElementById('sEmail').value.trim(),team=document.getElementById('sTeam').value.trim(),pass=document.getElementById('sPass').value;
  if(!first||!email||!team||!pass){showErr('signupErr','Please fill in all required fields');return}
  if(pass.length<8){showErr('signupErr','Password must be at least 8 characters');return}
  if(!email.includes('@')){showErr('signupErr','Please enter a valid email address');return}
  const newUser={email,pass,name:first+' '+last,team,init:(first[0]+(last?last[0]:'X')).toUpperCase()};
  USERS.push(newUser);loginSuccess(newUser);
}
function demoLogin(){loginSuccess(USERS[0]);}
function loginSuccess(u){
  currentUser=u;
  document.getElementById('uName').textContent=u.name.split(' ')[0];
  document.getElementById('uAvatar').textContent=u.init;
  document.getElementById('teamSub').textContent='5 members · '+u.team;
  document.getElementById('authScreen').classList.remove('show');
  document.getElementById('appScreen').classList.add('show');
  renderAll();showToast('👋 Welcome back, '+u.name.split(' ')[0]+'!');
}
function doLogout(){
  currentUser=null;
  document.getElementById('appScreen').classList.remove('show');
  document.getElementById('authScreen').classList.add('show');
  showToast('Signed out successfully');
}
function goTo(page,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');el.classList.add('active');
  if(page==='analytics')setTimeout(()=>{renderMBar();renderCPie();renderArea();renderHealth()},50);
  if(page==='settle')renderSettle();
  if(page==='team')renderTeam();
}
function renderKPI(){
  const spent=totalSpent(),pct=Math.round(spent/budget*100);
  const pending=expenses.filter(e=>e.status==='pending').length;
  const overC=CATS.filter(c=>catSpent(c.name)>c.limit).length;
  const kpis=[
    {lbl:'Total budget',val:fmtL(budget),badge:null,c:'#6c63ff'},
    {lbl:'Spent',val:fmtL(spent),badge:{t:pct+'%',cl:pct>80?'badge-r':'badge-g'},c:pct>80?'#f43f5e':'#00d4aa'},
    {lbl:'Remaining',val:fmtL(Math.max(0,budget-spent)),badge:null,c:'#00d4aa'},
    {lbl:'Overrun cats',val:overC+'/'+CATS.length,badge:{t:overC>0?'Alert':'Safe',cl:overC>0?'badge-r':'badge-g'},c:overC>0?'#f43f5e':'#00d4aa'},
    {lbl:'Pending',val:pending,badge:{t:'Review',cl:'badge-y'},c:'#ffa94d'},
  ];
  document.getElementById('kpiRow').innerHTML=kpis.map(k=>`<div class="kpi"><div class="kpi-top" style="background:${k.c}"></div><div class="kpi-lbl">${k.lbl}</div><div class="kpi-val">${k.val}</div>${k.badge?`<div class="badge ${k.badge.cl}">${k.badge.t}</div>`:''}</div>`).join('');
  const f=document.getElementById('bFill');f.style.width=Math.min(pct,100)+'%';f.style.background=pct>80?'#f43f5e':'#00d4aa';
  document.getElementById('bPct').textContent=pct+'%';document.getElementById('bPct').style.color=pct>80?'#f43f5e':'#00d4aa';
  document.getElementById('alertDot').style.display=pct>80?'block':'none';
}
function renderCatBars(){
  document.getElementById('catBars').innerHTML=CATS.map(c=>{
    const s=catSpent(c.name),p=Math.min(Math.round(s/c.limit*100),100),o=s>c.limit;
    return`<div class="cbi"><div class="cbh"><div class="cbn"><div class="cbd" style="background:${c.color}"></div>${c.icon} ${c.name}</div><div class="cbv"><span class="cbs" style="color:${o?'#f43f5e':c.color}">${fmtL(s)}</span><span class="cbm">/ ${fmtL(c.limit)}</span></div></div><div class="cbt"><div class="cbf" style="background:${o?'#f43f5e':c.color};width:${p}%"></div></div>${o?`<div style="font-size:9px;color:#ff4d8d;margin-top:2px;font-weight:500">⚠ ${fmtL(s-c.limit)} over limit</div>`:''}</div>`;}).join('');
}
function renderExpenses(){
  const q=(document.getElementById('searchInput')?.value||'').toLowerCase();
  const rows=expenses.filter(e=>!q||e.desc.toLowerCase().includes(q)||e.cat.toLowerCase().includes(q)||e.by.toLowerCase().includes(q));
  const ss={approved:'background:rgba(0,212,170,0.1);color:#00d4aa',pending:'background:rgba(255,169,77,0.1);color:#ffa94d',review:'background:rgba(77,166,255,0.1);color:#4da6ff'};
  const m=n=>MEMBERS.find(x=>x.name===n);
  document.getElementById('expenseList').innerHTML=rows.slice(0,8).map(e=>`<div class="ei"><div class="av" style="background:${m(e.by)?.bg};color:${m(e.by)?.color}">${m(e.by)?.init}</div><div><div class="en">${e.desc}</div><div class="em">${e.cat} · ${e.by} · split ${e.split==='all'?'5 ways':e.split+' ways'}</div></div><div class="ed">${e.date.slice(5)}</div><div class="ea" style="color:${CATS.find(c=>c.name===e.cat)?.color||'#fff'}">${fmt(e.amt)}</div><div><span class="es" style="${ss[e.status]}">${e.status}</span></div></div>`).join('')||'<div style="text-align:center;padding:24px;color:var(--t3);font-size:12px">No results</div>';
}
function renderDonut(){
  if(donutChart)donutChart.destroy();
  const d=CATS.map(c=>({...c,s:catSpent(c.name)})).filter(c=>c.s>0);
  donutChart=new Chart(document.getElementById('donutChart'),{type:'doughnut',data:{labels:d.map(c=>c.name),datasets:[{data:d.map(c=>c.s),backgroundColor:d.map(c=>c.color),borderWidth:0,hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' '+ctx.label+': '+fmtL(ctx.raw)}}}}});
  document.getElementById('donutLeg').innerHTML=d.map(c=>`<span style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--t3)"><span style="width:8px;height:8px;border-radius:2px;background:${c.color}"></span>${c.name}</span>`).join('');
}
function renderTrend(){
  if(trendChart)trendChart.destroy();
  const labels=[],data=[];
  for(let i=6;i>=0;i--){const d=new Date(2026,3,25-i);labels.push(d.toLocaleDateString('en',{weekday:'short'}));data.push(Math.round(expenses.filter(e=>e.date===d.toISOString().slice(0,10)).reduce((s,e)=>s+e.amt,0)/1000));}
  trendChart=new Chart(document.getElementById('trendChart'),{type:'line',data:{labels,datasets:[{data,borderColor:'#6c63ff',backgroundColor:'rgba(108,99,255,0.07)',fill:true,tension:0.4,pointRadius:4,pointBackgroundColor:'#6c63ff',borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'#52527a',font:{size:10}}},y:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'#52527a',font:{size:10},callback:v=>'₹'+v+'K'}}}}});
}
function renderInsights(){
  const spent=totalSpent(),pct=Math.round(spent/budget*100);
  const overC=CATS.filter(c=>catSpent(c.name)>c.limit);
  const topM=MEMBERS.reduce((a,b)=>memSpent(a.name)>memSpent(b.name)?a:b);
  const pending=expenses.filter(e=>e.status==='pending');
  const ins=[];
  if(pct>70)ins.push({ic:'🔥',bg:'rgba(244,63,94,0.1)',t:`${pct}% budget used`,d:`At this burn rate, you'll exceed budget in ~${Math.round((budget-spent)/(spent/30))} days.`});
  overC.forEach(c=>ins.push({ic:'⚠️',bg:'rgba(255,169,77,0.1)',t:`${c.name} exceeded limit`,d:`${fmtL(catSpent(c.name)-c.limit)} over the ${fmtL(c.limit)} cap.`}));
  ins.push({ic:'👑',bg:'rgba(108,99,255,0.1)',t:`Top spender: ${topM.name}`,d:`${topM.name} accounts for ${Math.round(memSpent(topM.name)/spent*100)}% of total team spend.`});
  if(pending.length)ins.push({ic:'⏳',bg:'rgba(77,166,255,0.1)',t:`${pending.length} pending approvals`,d:'Expenses stuck in review. Approve or reject to clear the queue.'});
  document.getElementById('insightsList').innerHTML=ins.slice(0,4).map(i=>`<div class="ins"><div class="ins-ic" style="background:${i.bg}">${i.ic}</div><div><div class="ins-t">${i.t}</div><div class="ins-d">${i.d}</div></div></div>`).join('');
}
function renderMBar(){
  if(mBarChart)mBarChart.destroy();
  mBarChart=new Chart(document.getElementById('memberBar'),{type:'bar',data:{labels:MEMBERS.map(m=>m.name),datasets:[{data:MEMBERS.map(m=>Math.round(memSpent(m.name)/1000)),backgroundColor:MEMBERS.map(m=>m.color),borderRadius:7,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'#52527a',font:{size:11}}},y:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'#52527a',font:{size:10},callback:v=>'₹'+v+'K'}}}}});
}
function renderCPie(){
  if(cPieChart)cPieChart.destroy();
  const d=CATS.map(c=>({...c,s:catSpent(c.name)}));
  cPieChart=new Chart(document.getElementById('catPie'),{type:'pie',data:{labels:d.map(c=>c.icon+' '+c.name),datasets:[{data:d.map(c=>c.s),backgroundColor:d.map(c=>c.color),borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:'#9898c8',font:{size:10},boxWidth:10,padding:8}}}}});
}
function renderArea(){
  if(aChart)aChart.destroy();
  const labels=[],data=[];
  for(let i=29;i>=0;i--){const d=new Date(2026,3,25-i);labels.push(i%5===0?d.toLocaleDateString('en',{month:'short',day:'numeric'}):'');data.push(Math.round(expenses.filter(e=>e.date===d.toISOString().slice(0,10)).reduce((s,e)=>s+e.amt,0)/1000));}
  aChart=new Chart(document.getElementById('areaChart'),{type:'line',data:{labels,datasets:[{data,borderColor:'#ff4d8d',backgroundColor:'rgba(255,77,141,0.06)',fill:true,tension:0.3,pointRadius:2,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,0.02)'},ticks:{color:'#52527a',font:{size:10}}},y:{grid:{color:'rgba(255,255,255,0.02)'},ticks:{color:'#52527a',font:{size:10},callback:v=>'₹'+v+'K'}}}}});
}
function renderHealth(){
  const score=Math.max(30,Math.round(100-Math.min(50,totalSpent()/budget*100)*0.5-CATS.filter(c=>catSpent(c.name)>c.limit).length*10));
  const sc=score>70?'#00d4aa':score>50?'#ffa94d':'#f43f5e';
  document.getElementById('scoreVal').style.color=sc;document.getElementById('scoreVal').textContent=score+'/100';
  const bars=[{lbl:'Budget discipline',v:Math.max(0,100-Math.round(totalSpent()/budget*100)),c:'#6c63ff'},{lbl:'Category compliance',v:Math.round(CATS.filter(c=>catSpent(c.name)<=c.limit).length/CATS.length*100),c:'#00d4aa'},{lbl:'Approval velocity',v:Math.round(expenses.filter(e=>e.status==='approved').length/expenses.length*100),c:'#4da6ff'},{lbl:'Cost efficiency',v:76,c:'#ffa94d'}];
  document.getElementById('healthBars').innerHTML=bars.map(b=>`<div class="hbar"><div class="hlbl">${b.lbl}</div><div class="htrk"><div class="hfil" style="background:${b.c};width:${b.v}%"></div></div><div class="hval" style="color:${b.c}">${b.v}%</div></div>`).join('');
}
function renderSettle(){
  const ph={};MEMBERS.forEach(m=>ph[m.name]=0);
  expenses.forEach(e=>{const n=e.split==='all'?5:parseInt(e.split);const sh=e.amt/n;ph[e.by]+=e.amt;MEMBERS.slice(0,n).forEach(m=>ph[m.name]-=sh);});
  const avg=Object.values(ph).reduce((a,b)=>a+b)/MEMBERS.length;Object.keys(ph).forEach(k=>ph[k]-=avg);
  let pos=[...MEMBERS.filter(m=>ph[m.name]>1).map(m=>({...m,b:ph[m

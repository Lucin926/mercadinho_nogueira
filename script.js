/* =========================================================
   NOGUEIRA — script.js
   Protótipo funcional em memória (sem backend / sem storage).
   ========================================================= */

/* ---------------- ÍCONES (SVG inline, estilo premium/linear) ---------------- */
const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9"/></svg>`,
  wallet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><path d="M16 14.2h2.2"/><path d="M7 6V5a2 2 0 0 1 2-2h5"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M11 20V4"/><path d="M18 20v-7"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.9l.06.06a2 2 0 1 1-2.85 2.85l-.06-.06a1.7 1.7 0 0 0-1.9-.34 1.7 1.7 0 0 0-1 1.55V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.9.34l-.06.06a2 2 0 1 1-2.85-2.85l.06-.06a1.7 1.7 0 0 0 .34-1.9 1.7 1.7 0 0 0-1.55-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.9l-.06-.06a2 2 0 1 1 2.85-2.85l.06.06a1.7 1.7 0 0 0 1.9.34H10a1.7 1.7 0 0 0 1-1.55V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.9-.34l.06-.06a2 2 0 1 1 2.85 2.85l-.06.06a1.7 1.7 0 0 0-.34 1.9V10c.14.6.6 1.1 1.55 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/></svg>`,
  exit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h12"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 19c1.1-3.2 3.6-4.8 6.2-4.8s5.1 1.6 6.2 4.8"/><circle cx="17" cy="8.5" r="2.4"/><path d="M15.5 14.4c2 .1 3.9 1.5 4.7 3.9"/></svg>`,
  hourglass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12"/><path d="M7 3c0 4 3 5 5 6.2C10 10.4 7 11.4 7 15.4"/><path d="M17 3c0 4-3 5-5 6.2 2 1.2 5 2.2 5 6.2"/><path d="M7 21c0-4 3-5 5-6.2M17 21c0-4-3-5-5-6.2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 9.5 17.5 19.5 6.5"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.3-4.3"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5 7 12l7.5 7"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v4h4"/></svg>`,
  print: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8V4h10v4"/><rect x="5" y="8" width="14" height="8" rx="1.5"/><path d="M7 16h10v5H7z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="M8.2 10.8 15.8 6.2M8.2 13.2l7.6 4.6"/></svg>`,
  cash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6.5" width="19" height="11" rx="2"/><circle cx="12" cy="12" r="2.6"/></svg>`,
  pix: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 4.5 4.5 8.5a2.8 2.8 0 0 0 0 4l4 4a2.8 2.8 0 0 0 4 0l4-4a2.8 2.8 0 0 0 0-4l-4-4a2.8 2.8 0 0 0-4 0Z"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="2.2"/><path d="M2.5 10h19"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 16 9 10.5l4 4 7-7.5"/><path d="M15.5 6.5H20V11"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 4.8 19 8.6 8.4 19.2 4 20l.8-4.4Z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M7 7l1 12.5A1.5 1.5 0 0 0 9.5 21h5a1.5 1.5 0 0 0 1.5-1.5L17 7"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 5.5 16 12l-6.5 6.5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>`,
};
function paintIcons(root=document){
  root.querySelectorAll('[data-ico]').forEach(el=>{
    const key = el.getAttribute('data-ico');
    if(ICONS[key] && !el.dataset.painted){ el.innerHTML = ICONS[key]; el.dataset.painted = '1'; }
  });
}

/* ---------------- ESTADO / DADOS (mock, em memória) ---------------- */
const TODAY = new Date(2026, 6, 31, 16, 20); // 31 de julho de 2026

let uid = 1000;
const nextId = () => (uid++).toString();

function mkDate(y,m,d,h=12,mi=0){ return new Date(y,m,d,h,mi); }

const clients = [
  { id:'c1', name:'João da Silva', nickname:'João', phone:'(92) 98888-1111', note:'' },
  { id:'c2', name:'Maria Souza', nickname:'', phone:'(92) 99999-2222', note:'' },
  { id:'c3', name:'Carlos Pereira', nickname:'Carlinhos', phone:'(92) 98777-3333', note:'' },
  { id:'c4', name:'Ana Beatriz Lima', nickname:'Ana', phone:'', note:'' },
  { id:'c5', name:'Roberto Nunes', nickname:'', phone:'(92) 98555-5555', note:'' },
  { id:'c6', name:'Fernanda Costa', nickname:'Fê', phone:'(92) 98222-9090', note:'' },
  { id:'c7', name:'Paulo Ricardo', nickname:'', phone:'', note:'' },
  { id:'c8', name:'Juliana Alves', nickname:'Ju', phone:'(92) 99111-4040', note:'' },
];

const accounts = [
  {
    id:'a1', clientId:'c1', status:'aberta', openedAt: mkDate(2026,6,10,9,0),
    purchases:[
      { id:'p1', desc:'Arroz e feijão', value:42.5, date: mkDate(2026,6,10,9,0), note:'' },
      { id:'p2', desc:'Refrigerante 2L', value:28.0, date: mkDate(2026,6,31,14,30), note:'' },
      { id:'p3', desc:'Pão e manteiga', value:75.5, date: mkDate(2026,6,20,8,10), note:'' },
    ], payment:null
  },
  {
    id:'a2', clientId:'c2', status:'aberta', openedAt: mkDate(2026,6,3,10,0),
    purchases:[
      { id:'p4', desc:'Carnes e frios', value:120.5, date: mkDate(2026,6,3,10,0), note:'' },
      { id:'p5', desc:'Verduras', value:22.0, date: mkDate(2026,6,29,9,0), note:'' },
      { id:'p6', desc:'Óleo e sal', value:43.0, date: mkDate(2026,6,31,10,45), note:'' },
    ], payment:null
  },
  {
    id:'a3', clientId:'c3', status:'aberta', openedAt: mkDate(2026,6,15,11,0),
    purchases:[
      { id:'p7', desc:'Bebidas diversas', value:96.0, date: mkDate(2026,6,15,11,0), note:'' },
      { id:'p8', desc:'Café e açúcar', value:31.9, date: mkDate(2026,6,30,17,20), note:'' },
    ], payment:null
  },
  {
    id:'a4', clientId:'c6', status:'aberta', openedAt: mkDate(2026,6,25,15,0),
    purchases:[
      { id:'p9', desc:'Higiene pessoal', value:54.3, date: mkDate(2026,6,25,15,0), note:'' },
    ], payment:null
  },
  {
    id:'a5', clientId:'c7', status:'aberta', openedAt: mkDate(2026,5,20,10,0),
    purchases:[
      { id:'p10', desc:'Mercado do mês', value:210.0, date: mkDate(2026,5,20,10,0), note:'' },
      { id:'p11', desc:'Bebidas', value:38.0, date: mkDate(2026,6,28,19,0), note:'' },
    ], payment:null
  },
  {
    id:'a6', clientId:'c4', status:'concluida', openedAt: mkDate(2026,6,1,9,0),
    purchases:[
      { id:'p12', desc:'Compras da semana', value:132.0, date: mkDate(2026,6,1,9,0), note:'' },
      { id:'p13', desc:'Padaria', value:18.5, date: mkDate(2026,6,5,8,0), note:'' },
    ], payment:{ method:'Pix', date: mkDate(2026,6,29,16,0), note:'' }
  },
  {
    id:'a7', clientId:'c5', status:'concluida', openedAt: mkDate(2026,6,10,9,0),
    purchases:[
      { id:'p14', desc:'Mercado geral', value:245.9, date: mkDate(2026,6,10,9,0), note:'' },
    ], payment:{ method:'Dinheiro', date: mkDate(2026,6,25,12,0), note:'' }
  },
  {
    id:'a8', clientId:'c8', status:'concluida', openedAt: mkDate(2026,6,2,9,0),
    purchases:[
      { id:'p15', desc:'Compras diversas', value:88.0, date: mkDate(2026,6,2,9,0), note:'' },
      { id:'p16', desc:'Bebidas', value:44.0, date: mkDate(2026,6,18,10,0), note:'' },
    ], payment:{ method:'Cartão', date: mkDate(2026,6,20,11,30), note:'' }
  },
  {
    id:'a9', clientId:'c1', status:'concluida', openedAt: mkDate(2026,5,2,9,0),
    purchases:[
      { id:'p17', desc:'Mercado de junho', value:310.0, date: mkDate(2026,5,2,9,0), note:'' },
    ],
    /* conta aberta em junho, mas paga somente em julho: o valor deve continuar
       contando como "recebido" em junho, e não em julho */
    payment:{ method:'Pix', date: mkDate(2026,6,15,9,0), note:'' }
  },
];

/* ---------------- HELPERS ---------------- */
const BRL = v => v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const MESES_ABR = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function two(n){ return n.toString().padStart(2,'0'); }
function fmtDate(d){ return `${two(d.getDate())}/${two(d.getMonth()+1)}/${d.getFullYear()}`; }
function fmtHora(d){ return `${two(d.getHours())}:${two(d.getMinutes())}`; }
function fmtDateHora(d){ return `${fmtDate(d)}, às ${fmtHora(d)}`; }
function isSameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function relDay(d){
  if(isSameDay(d, TODAY)) return `Hoje, às ${fmtHora(d)}`;
  const y = new Date(TODAY); y.setDate(y.getDate()-1);
  if(isSameDay(d,y)) return `Ontem, às ${fmtHora(d)}`;
  return fmtDateHora(d);
}
function clientById(id){ return clients.find(c=>c.id===id); }
function accountTotal(acc){ return acc.purchases.reduce((s,p)=>s+p.value,0); }
function lastPurchase(acc){ return acc.purchases.slice().sort((a,b)=>b.date-a.date)[0]; }
function openAccounts(){ return accounts.filter(a=>a.status==='aberta'); }
function closedFechada(){ return accounts.filter(a=>a.status==='fechada'); }
function pendingAccounts(){ return accounts.filter(a=>a.status==='aberta'||a.status==='fechada'); }
function closedAccounts(){ return accounts.filter(a=>a.status==='concluida'); }

/* A conta pertence ao mês em que foi ABERTA (competência), independente de quando é paga */
function competencia(acc){ return { m: acc.openedAt.getMonth(), y: acc.openedAt.getFullYear() }; }
function isBeforeCurrentMonth(y,m){ return (y < TODAY.getFullYear()) || (y===TODAY.getFullYear() && m < TODAY.getMonth()); }

/* Ao virar o mês, toda conta ainda "aberta" de um mês anterior passa a "fechada":
   continua com o valor pendente, vinculada ao mês original, sem poder receber novas compras. */
function autoCloseAccounts(){
  accounts.forEach(acc=>{
    if(acc.status==='aberta'){
      const c = competencia(acc);
      if(isBeforeCurrentMonth(c.y, c.m)) acc.status = 'fechada';
    }
  });
}

/* Cliente não pode abrir nova conta enquanto tiver uma conta aberta OU fechada (pendente de pagamento) */
function clientPendingAccount(clientId){ return pendingAccounts().find(a=>a.clientId===clientId); }

function showToast(msg, icon='check'){
  const t = document.getElementById('toast');
  t.innerHTML = `<span class="ico">${ICONS[icon]||''}</span><span>${msg}</span>`;
  t.classList.add('is-show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> t.classList.remove('is-show'), 2600);
}

/* ---------------- NAVEGAÇÃO ---------------- */
const PAGE_TITLES = {
  inicio: ['Início','Visão geral da sua loja hoje'],
  contas: ['Contas','Contas em aberto no momento'],
  'conta-detalhe': ['Detalhes da conta','Compras e movimentações desta conta'],
  historico: ['Histórico','Contas já pagas'],
  'historico-detalhe': ['Detalhes do histórico','Consulta de conta finalizada'],
  relatorios: ['Relatórios','Desempenho da sua loja'],
  configuracoes: ['Configurações','Preferências do sistema'],
  perfil: ['Perfil','Seus dados de proprietário'],
};

function goTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('is-active'));
  document.getElementById('page-'+page).classList.add('is-active');

  document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.classList.toggle('is-active', b.dataset.page===page));
  document.querySelectorAll('.bn-item[data-page]').forEach(b=>b.classList.toggle('is-active', b.dataset.page===page));

  const [title, sub] = PAGE_TITLES[page] || ['',''];
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = sub;

  if(page==='inicio') renderInicio();
  if(page==='contas') renderContas();
  if(page==='historico') renderHistorico();
  if(page==='relatorios') renderRelatorios();

  window.scrollTo({top:0, behavior:'smooth'});
  closeSheet();
}

document.querySelectorAll('[data-page]').forEach(btn=>{
  btn.addEventListener('click', ()=> goTo(btn.dataset.page));
});
document.querySelectorAll('[data-back]').forEach(btn=>{
  btn.addEventListener('click', ()=> goTo(btn.dataset.back));
});

/* ---------------- RENDER: INÍCIO ---------------- */
/* Mês em consulta na página inicial. Por padrão, o mês atual. */
let homeMonth = TODAY.getMonth();
let homeYear = TODAY.getFullYear();

/* Estatísticas de um mês, sempre pela competência (mês em que a conta foi aberta),
   e não pela data em que o pagamento efetivamente aconteceu. */
function computeMonthStats(m, y){
  const inMonth = acc => { const c = competencia(acc); return c.m===m && c.y===y; };
  const pendentes = accounts.filter(a=> inMonth(a) && (a.status==='aberta' || a.status==='fechada'));
  const pagas = accounts.filter(a=> inMonth(a) && a.status==='concluida');
  return {
    totalAReceber: pendentes.reduce((s,a)=>s+accountTotal(a),0),
    totalRecebido: pagas.reduce((s,a)=>s+accountTotal(a),0),
    qtdPendentes: pendentes.length,
    qtdPagas: pagas.length,
  };
}

function updateMonthNavUI(){
  const label = `${MESES[homeMonth][0].toUpperCase()+MESES[homeMonth].slice(1)} de ${homeYear}`;
  document.getElementById('homeMonthLabel').textContent = label;
  const atCurrent = homeMonth===TODAY.getMonth() && homeYear===TODAY.getFullYear();
  document.getElementById('btnMesProximo').disabled = atCurrent;
  document.getElementById('btnMesAtual').hidden = atCurrent;
}

function renderInicio(){
  autoCloseAccounts();
  document.getElementById('statClientes').textContent = clients.length;

  updateMonthNavUI();
  const stats = computeMonthStats(homeMonth, homeYear);

  document.getElementById('statAReceber').textContent = BRL(stats.totalAReceber);
  document.getElementById('statConcluidos').textContent = BRL(stats.totalRecebido);
  document.getElementById('statAReceberMes').textContent = `${stats.qtdPendentes} conta(s) pendente(s)`;
  document.getElementById('statConcluidosMes').textContent = `${stats.qtdPagas} pagamento(s) concluído(s)`;

  const withMoves = openAccounts()
    .map(acc=>({acc, last: lastPurchase(acc)}))
    .filter(x=>x.last)
    .sort((a,b)=> b.last.date - a.last.date)
    .slice(0,5);

  const list = document.getElementById('movesList');
  if(withMoves.length===0){
    list.innerHTML = `<div class="empty-state"><span class="ico ico-lg" data-ico="wallet"></span><h3>Nenhuma movimentação recente</h3><p>As contas com novas compras aparecerão aqui.</p></div>`;
  } else {
    list.innerHTML = withMoves.map(({acc,last})=>{
      const cl = clientById(acc.clientId);
      const initials = cl.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
      return `
      <div class="move-item">
        <div class="move-main">
          <span class="move-avatar">${initials}</span>
          <div class="move-text">
            <strong>${cl.name}</strong>
            <span>${last.desc}</span>
            <small>Última compra: ${BRL(last.value)} · ${relDay(last.date)}</small>
          </div>
        </div>
        <div class="move-right">
          <strong>Total: ${BRL(accountTotal(acc))}</strong>
          <button class="btn btn-secondary" data-open-acc="${acc.id}">Ver conta</button>
        </div>
      </div>`;
    }).join('');
  }
  paintIcons(list);
  wireOpenAccountButtons(list);
}

function wireOpenAccountButtons(root){
  root.querySelectorAll('[data-open-acc]').forEach(btn=>{
    btn.addEventListener('click', ()=> openContaDetalhe(btn.dataset.openAcc));
  });
}
function wireOpenHistoricoButtons(root){
  root.querySelectorAll('[data-open-hist]').forEach(btn=>{
    btn.addEventListener('click', ()=> openHistoricoDetalhe(btn.dataset.openHist));
  });
}
function wireAddCompraButtons(root){
  root.querySelectorAll('[data-add-compra]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{ e.stopPropagation(); openModalCompra(btn.dataset.addCompra); });
  });
}

/* ---------------- RENDER: CONTAS ---------------- */
let contasSort = 'recentes';
let contasSearch = '';

function renderContas(){
  let list = pendingAccounts().filter(acc=>{
    const cl = clientById(acc.clientId);
    return cl.name.toLowerCase().includes(contasSearch.toLowerCase());
  });

  list = list.slice().sort((a,b)=>{
    if(contasSort==='recentes') return (lastPurchase(b)?.date||b.openedAt) - (lastPurchase(a)?.date||a.openedAt);
    if(contasSort==='antigas') return (lastPurchase(a)?.date||a.openedAt) - (lastPurchase(b)?.date||b.openedAt);
    if(contasSort==='maior') return accountTotal(b) - accountTotal(a);
    if(contasSort==='menor') return accountTotal(a) - accountTotal(b);
    return 0;
  });

  document.getElementById('contasEmpty').hidden = list.length>0;

  const statusBadge = acc => acc.status==='fechada'
    ? `<span class="badge badge-closed">Fechada</span>`
    : `<span class="badge badge-open">Aberta</span>`;
  const addCompraBtn = acc => acc.status==='fechada'
    ? `<button class="btn btn-secondary" disabled title="Conta fechada: aguardando pagamento">Fechada</button>`
    : `<button class="btn btn-primary" data-add-compra="${acc.id}">Adicionar compra</button>`;

  const tbody = document.getElementById('tableContasBody');
  tbody.innerHTML = list.map(acc=>{
    const cl = clientById(acc.clientId);
    const lp = lastPurchase(acc);
    return `<tr>
      <td><strong>${cl.name}</strong></td>
      <td>${statusBadge(acc)}</td>
      <td>${fmtDate(acc.openedAt)}</td>
      <td>${lp ? relDay(lp.date) : '—'}</td>
      <td>${acc.purchases.length}</td>
      <td><strong>${BRL(accountTotal(acc))}</strong></td>
      <td>
        <div class="row-actions">
          <button class="btn btn-secondary" data-open-acc="${acc.id}">Ver conta</button>
          ${addCompraBtn(acc)}
        </div>
      </td>
    </tr>`;
  }).join('');

  const grid = document.getElementById('cardsContasMobile');
  grid.innerHTML = list.map(acc=>{
    const cl = clientById(acc.clientId);
    const lp = lastPurchase(acc);
    return `<div class="item-card">
      <div class="item-card-top"><strong>${cl.name}</strong><span class="value">${BRL(accountTotal(acc))}</span></div>
      <p>${statusBadge(acc)}</p>
      <p>Conta aberta em ${fmtDate(acc.openedAt)}</p>
      <p>${lp ? 'Última compra ' + relDay(lp.date) : 'Sem compras registradas'}</p>
      <p>${acc.purchases.length} registro(s)</p>
      <div class="item-actions">
        <button class="btn btn-secondary" data-open-acc="${acc.id}">Ver conta</button>
        ${addCompraBtn(acc)}
      </div>
    </div>`;
  }).join('');

  [tbody, grid].forEach(el=>{ wireOpenAccountButtons(el); wireAddCompraButtons(el); });
}

document.getElementById('searchContas').addEventListener('input', e=>{ contasSearch = e.target.value; renderContas(); });
document.getElementById('sortContas').addEventListener('change', e=>{ contasSort = e.target.value; renderContas(); });

/* ---------------- DETALHES DA CONTA ABERTA ---------------- */
let currentAccountId = null;

function openContaDetalhe(accId){
  currentAccountId = accId;
  const acc = accounts.find(a=>a.id===accId);
  const cl = clientById(acc.clientId);
  const lp = lastPurchase(acc);

  document.getElementById('dcNome').textContent = cl.name;
  document.getElementById('dcMeta').textContent = `Aberta em ${fmtDate(acc.openedAt)} · Última movimentação: ${lp ? relDay(lp.date) : '—'}`;
  document.getElementById('dcTotal').textContent = BRL(accountTotal(acc));

  const isFechada = acc.status==='fechada';
  document.getElementById('dcClosedBanner').hidden = !isFechada;
  const btnAdd = document.getElementById('btnAddCompra');
  btnAdd.disabled = isFechada;
  btnAdd.title = isFechada ? 'Conta fechada: não é possível adicionar novas compras' : '';

  const list = document.getElementById('purchasesList');
  const sorted = acc.purchases.slice().sort((a,b)=>b.date-a.date);
  list.innerHTML = sorted.length ? sorted.map(p=>`
    <div class="purchase-item">
      <div>
        <strong>${p.desc}</strong>
        <div class="p-meta">${fmtDate(p.date)} às ${fmtHora(p.date)}</div>
        ${p.note ? `<div class="p-obs">${p.note}</div>` : ''}
      </div>
      <div style="display:flex; align-items:center; gap:14px;">
        <span class="purchase-value">${BRL(p.value)}</span>
        <div class="purchase-actions">
          <button class="icon-btn" data-edit-purchase="${p.id}"><span class="ico" data-ico="edit"></span></button>
          <button class="icon-btn danger" data-del-purchase="${p.id}"><span class="ico" data-ico="trash"></span></button>
        </div>
      </div>
    </div>
  `).join('') : `<div class="empty-state"><span class="ico ico-lg" data-ico="wallet"></span><h3>Nenhuma compra registrada</h3><p>Adicione a primeira compra desta conta.</p></div>`;

  paintIcons(list);
  list.querySelectorAll('[data-edit-purchase]').forEach(b=> b.addEventListener('click', ()=> openModalCompra(accId, b.dataset.editPurchase)));
  list.querySelectorAll('[data-del-purchase]').forEach(b=> b.addEventListener('click', ()=> deletePurchase(accId, b.dataset.delPurchase)));

  goTo('conta-detalhe');
}

function deletePurchase(accId, purchaseId){
  const acc = accounts.find(a=>a.id===accId);
  acc.purchases = acc.purchases.filter(p=>p.id!==purchaseId);
  showToast('Registro excluído.', 'trash');
  openContaDetalhe(accId);
}

document.getElementById('btnAddCompra').addEventListener('click', ()=> openModalCompra(currentAccountId));
document.getElementById('btnConcluirPagamento').addEventListener('click', ()=> openModalPagamento(currentAccountId));

/* ---------------- MODAL: NOVA CONTA ---------------- */
const modalNovaConta = document.getElementById('modalNovaConta');
let pendingOpenClientId = null;

function openModalNovaConta(){
  document.getElementById('searchClientModal').value='';
  document.getElementById('newClientNome').value='';
  document.getElementById('newClientApelido').value='';
  document.getElementById('newClientTelefone').value='';
  document.getElementById('newClientObs').value='';
  document.getElementById('clientHasOpenWarning').hidden = true;
  renderClientResults('');
  openModal(modalNovaConta);
}

function renderClientResults(query){
  const box = document.getElementById('clientResults');
  const q = query.trim().toLowerCase();
  if(!q){ box.innerHTML=''; return; }
  const matches = clients.filter(c=>c.name.toLowerCase().includes(q)).slice(0,6);
  box.innerHTML = matches.map(c=>`
    <div class="client-row">
      <div><div class="cr-name">${c.name}</div><div class="cr-phone">${c.phone||'Sem telefone'}</div></div>
      <button class="btn btn-primary" data-pick-client="${c.id}">Selecionar</button>
    </div>
  `).join('') || `<p class="muted" style="padding:8px 2px;">Nenhum cliente encontrado. Cadastre abaixo.</p>`;

  box.querySelectorAll('[data-pick-client]').forEach(b=>{
    b.addEventListener('click', ()=> handlePickClient(b.dataset.pickClient));
  });
}
document.getElementById('searchClientModal').addEventListener('input', e=> renderClientResults(e.target.value));

function handlePickClient(clientId){
  const pendingAcc = clientPendingAccount(clientId);
  if(pendingAcc){
    pendingOpenClientId = pendingAcc.id;
    const msg = pendingAcc.status==='fechada'
      ? 'Este cliente possui uma conta fechada aguardando pagamento. É preciso concluir o pagamento antes de abrir uma nova conta.'
      : 'Este cliente já possui uma conta em aberto.';
    document.getElementById('clientHasOpenWarningText').textContent = msg;
    document.getElementById('clientHasOpenWarning').hidden = false;
  } else {
    createAccountForClient(clientId);
  }
}
document.getElementById('btnAcessarContaAtual').addEventListener('click', ()=>{
  closeModal(modalNovaConta);
  openContaDetalhe(pendingOpenClientId);
});

document.getElementById('btnCadastrarEAbrir').addEventListener('click', ()=>{
  const nome = document.getElementById('newClientNome').value.trim();
  if(!nome){ showToast('Informe o nome do cliente.', 'close'); return; }
  const novo = {
    id:'c'+nextId(), name:nome,
    nickname:document.getElementById('newClientApelido').value.trim(),
    phone:document.getElementById('newClientTelefone').value.trim(),
    note:document.getElementById('newClientObs').value.trim(),
  };
  clients.push(novo);
  createAccountForClient(novo.id);
});

function createAccountForClient(clientId){
  const acc = { id:'a'+nextId(), clientId, status:'aberta', openedAt:new Date(TODAY), purchases:[], payment:null };
  accounts.push(acc);
  closeModal(modalNovaConta);
  showToast('Conta criada com sucesso.');
  renderContas();
  openContaDetalhe(acc.id);
}

document.getElementById('btnNovaContaTop').addEventListener('click', openModalNovaConta);
document.getElementById('btnNovaContaContas').addEventListener('click', openModalNovaConta);

/* ---------------- MODAL: ADICIONAR / EDITAR COMPRA ---------------- */
const modalCompra = document.getElementById('modalCompra');
let compraTargetAccId = null;
let compraEditId = null;

function openModalCompra(accId, purchaseId=null){
  compraTargetAccId = accId;
  compraEditId = purchaseId;
  const acc = accounts.find(a=>a.id===accId);
  if(purchaseId){
    const p = acc.purchases.find(x=>x.id===purchaseId);
    document.getElementById('compraDesc').value = p.desc;
    document.getElementById('compraValor').value = p.value.toFixed(2).replace('.',',');
    document.getElementById('compraObs').value = p.note||'';
    document.querySelector('#modalCompra .modal-head h3').textContent = 'Editar compra';
  } else {
    document.getElementById('compraDesc').value='';
    document.getElementById('compraValor').value='';
    document.getElementById('compraObs').value='';
    document.querySelector('#modalCompra .modal-head h3').textContent = 'Adicionar compra';
  }
  openModal(modalCompra);
}

document.getElementById('btnSalvarCompra').addEventListener('click', ()=>{
  const desc = document.getElementById('compraDesc').value.trim();
  const rawValor = document.getElementById('compraValor').value.replace(/\./g,'').replace(',','.');
  const valor = parseFloat(rawValor);

  if(!desc){ showToast('Informe o produto ou descrição.', 'close'); return; }
  if(isNaN(valor) || valor<=0){ showToast('Informe um valor válido.', 'close'); return; }

  const acc = accounts.find(a=>a.id===compraTargetAccId);
  const note = document.getElementById('compraObs').value.trim();

  if(compraEditId){
    const p = acc.purchases.find(x=>x.id===compraEditId);
    p.desc=desc; p.value=valor; p.note=note;
    showToast('Compra atualizada.');
  } else {
    acc.purchases.push({ id:'p'+nextId(), desc, value:valor, date:new Date(TODAY), note });
    showToast('Compra registrada com sucesso.');
  }
  closeModal(modalCompra);
  if(document.getElementById('page-conta-detalhe').classList.contains('is-active')) openContaDetalhe(compraTargetAccId);
  renderContas(); renderInicio();
});

/* money input mask (simple) */
document.getElementById('compraValor').addEventListener('input', e=>{
  let v = e.target.value.replace(/\D/g,'');
  if(!v){ e.target.value=''; return; }
  v = (parseInt(v,10)/100).toFixed(2);
  e.target.value = v.replace('.',',').replace(/\B(?=(\d{3})+(?!\d)\,)/g,'.');
});

/* ---------------- MODAL: CONCLUIR PAGAMENTO ---------------- */
const modalPagamento = document.getElementById('modalPagamento');
let payTargetAccId = null;
let selectedMethod = 'Dinheiro';

function openModalPagamento(accId){
  payTargetAccId = accId;
  const acc = accounts.find(a=>a.id===accId);
  const cl = clientById(acc.clientId);
  document.getElementById('paySummary').innerHTML = `
    <div class="ps-row"><span>Cliente</span><strong>${cl.name}</strong></div>
    <div class="ps-row"><span>Aberta em</span><span>${fmtDate(acc.openedAt)}</span></div>
    <div class="ps-row"><span>Registros</span><span>${acc.purchases.length}</span></div>
    <div class="ps-row ps-total"><span>Total</span><strong>${BRL(accountTotal(acc))}</strong></div>
  `;
  selectedMethod = 'Dinheiro';
  document.querySelectorAll('#payMethods .method-btn').forEach(b=>b.classList.toggle('is-active', b.dataset.method===selectedMethod));
  document.getElementById('pagamentoObs').value='';
  openModal(modalPagamento);
}

document.querySelectorAll('#payMethods .method-btn').forEach(b=>{
  b.addEventListener('click', ()=>{
    selectedMethod = b.dataset.method;
    document.querySelectorAll('#payMethods .method-btn').forEach(x=>x.classList.toggle('is-active', x===b));
  });
});

document.getElementById('btnConfirmarPagamento').addEventListener('click', ()=>{
  const acc = accounts.find(a=>a.id===payTargetAccId);
  acc.status='concluida';
  acc.payment = { method:selectedMethod, date:new Date(TODAY), note:document.getElementById('pagamentoObs').value.trim() };
  closeModal(modalPagamento);
  showToast('Pagamento concluído com sucesso.');
  renderContas(); renderInicio();
  goTo('contas');
});

/* ---------------- RENDER: HISTÓRICO ---------------- */
let historicoSearch = '';

function renderHistorico(){
  let list = closedAccounts().filter(acc=> clientById(acc.clientId).name.toLowerCase().includes(historicoSearch.toLowerCase()));
  list = list.slice().sort((a,b)=> b.payment.date - a.payment.date);

  document.getElementById('historicoEmpty').hidden = list.length>0;

  const tbody = document.getElementById('tableHistoricoBody');
  tbody.innerHTML = list.map(acc=>{
    const cl = clientById(acc.clientId);
    return `<tr>
      <td><strong>${cl.name}</strong></td>
      <td>${BRL(accountTotal(acc))}</td>
      <td>${fmtDate(acc.payment.date)} às ${fmtHora(acc.payment.date)}</td>
      <td>${acc.payment.method}</td>
      <td><div class="row-actions"><button class="btn btn-secondary" data-open-hist="${acc.id}">Ver detalhes</button></div></td>
    </tr>`;
  }).join('');

  const grid = document.getElementById('cardsHistoricoMobile');
  grid.innerHTML = list.map(acc=>{
    const cl = clientById(acc.clientId);
    return `<div class="item-card">
      <div class="item-card-top"><strong>${cl.name}</strong><span class="value">${BRL(accountTotal(acc))}</span></div>
      <p>${fmtDate(acc.payment.date)} às ${fmtHora(acc.payment.date)} · ${acc.payment.method}</p>
      <div class="item-actions"><button class="btn btn-secondary" data-open-hist="${acc.id}">Ver detalhes</button></div>
    </div>`;
  }).join('');

  [tbody, grid].forEach(wireOpenHistoricoButtons);
}
document.getElementById('searchHistorico').addEventListener('input', e=>{ historicoSearch=e.target.value; renderHistorico(); });

function openHistoricoDetalhe(accId){
  const acc = accounts.find(a=>a.id===accId);
  const cl = clientById(acc.clientId);
  document.getElementById('hdNome').textContent = cl.name;
  document.getElementById('hdMeta').textContent = `Conta nº ${acc.id.toUpperCase()} · Aberta em ${fmtDate(acc.openedAt)} · Concluída em ${fmtDate(acc.payment.date)} às ${fmtHora(acc.payment.date)} · ${acc.payment.method}`;

  const list = document.getElementById('hdPurchasesList');
  const sorted = acc.purchases.slice().sort((a,b)=>b.date-a.date);
  list.innerHTML = sorted.map(p=>`
    <div class="purchase-item">
      <div>
        <strong>${p.desc}</strong>
        <div class="p-meta">${fmtDate(p.date)} às ${fmtHora(p.date)}</div>
        ${p.note ? `<div class="p-obs">${p.note}</div>` : ''}
      </div>
      <span class="purchase-value">${BRL(p.value)}</span>
    </div>
  `).join('') + `<div class="purchase-item" style="background:var(--ivory-2);"><strong>Total pago</strong><span class="purchase-value">${BRL(accountTotal(acc))}</span></div>`;

  document.getElementById('btnExportarPDF').onclick = ()=> { showToast('Gerando PDF da conta...', 'file'); window.print(); };
  document.getElementById('btnImprimir').onclick = ()=> window.print();
  document.getElementById('btnCompartilhar').onclick = ()=> showToast('Link de compartilhamento copiado.', 'share');
  document.getElementById('btnNovaContaCliente').onclick = ()=> createAccountForClient(acc.clientId);

  goTo('historico-detalhe');
}

/* ---------------- RELATÓRIOS ---------------- */
let reportFilter = 'mes';
let reportMonth = TODAY.getMonth();
let reportYear = TODAY.getFullYear();

function setupReportFilters(){
  const selMes = document.getElementById('selMes');
  const selAno = document.getElementById('selAno');
  const mesesOrdenados = [];
  for(let i=0;i<12;i++){ mesesOrdenados.push((TODAY.getMonth()-i+12)%12); }
  selMes.innerHTML = mesesOrdenados.map(m=> `<option value="${m}">${MESES[m][0].toUpperCase()+MESES[m].slice(1)}</option>`).join('');
  selAno.innerHTML = [TODAY.getFullYear(), TODAY.getFullYear()-1].map(y=>`<option value="${y}">${y}</option>`).join('');
  selMes.value = TODAY.getMonth();
  selAno.value = TODAY.getFullYear();

  selMes.addEventListener('change', ()=>{ reportMonth=parseInt(selMes.value); reportYear=parseInt(selAno.value); renderRelatorios(); });
  selAno.addEventListener('change', ()=>{ reportMonth=parseInt(selMes.value); reportYear=parseInt(selAno.value); renderRelatorios(); });
}

document.querySelectorAll('#reportFilters .chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    document.querySelectorAll('#reportFilters .chip').forEach(c=>c.classList.remove('is-active'));
    chip.classList.add('is-active');
    reportFilter = chip.dataset.filter;
    document.getElementById('customFilter').hidden = reportFilter!=='personalizado';
    renderRelatorios();
  });
});

function inReportRange(d){
  if(reportFilter==='hoje') return isSameDay(d, TODAY);
  if(reportFilter==='7dias'){
    const start = new Date(TODAY); start.setDate(start.getDate()-6); start.setHours(0,0,0,0);
    return d >= start && d <= TODAY;
  }
  if(reportFilter==='mes') return d.getMonth()===TODAY.getMonth() && d.getFullYear()===TODAY.getFullYear();
  if(reportFilter==='personalizado') return d.getMonth()===reportMonth && d.getFullYear()===reportYear;
  return true;
}

function renderRelatorios(){
  const pagos = closedAccounts().filter(a=> inReportRange(a.payment.date));
  const faturamento = pagos.reduce((s,a)=>s+accountTotal(a),0);

  const abertas = pendingAccounts();
  const aReceber = abertas.reduce((s,a)=>s+accountTotal(a),0);

  document.getElementById('repFaturamento').textContent = BRL(faturamento);
  document.getElementById('repAReceber').textContent = BRL(aReceber);
  document.getElementById('repQtdPagos').textContent = pagos.length;
  document.getElementById('repQtdAbertas').textContent = abertas.length;

  /* formas de pagamento */
  const methods = { 'Dinheiro':0, 'Pix':0, 'Cartão':0 };
  const methodCount = { 'Dinheiro':0, 'Pix':0, 'Cartão':0 };
  pagos.forEach(a=>{ methods[a.payment.method]+= accountTotal(a); methodCount[a.payment.method]++; });
  const total = Object.values(methods).reduce((a,b)=>a+b,0) || 1;
  const colors = { 'Dinheiro':'#2E9B5C', 'Pix':'#3E7BC4', 'Cartão':'#C68A4E' };

  let acc0 = 0;
  const segs = Object.entries(methods).map(([k,v])=>{
    const frac = v/total;
    const seg = { key:k, frac, start:acc0 };
    acc0 += frac;
    return seg;
  });
  const R = 50, C = 60;
  const circumference = 2*Math.PI*R;
  const donut = document.getElementById('donutChart');
  donut.innerHTML = `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="var(--line)" stroke-width="14"/>` +
    segs.filter(s=>s.frac>0).map(s=>{
      const dash = circumference*s.frac;
      const gap = circumference-dash;
      const offset = -circumference*s.start;
      return `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${colors[s.key]}" stroke-width="14"
        stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${offset}" transform="rotate(-90 ${C} ${C})" stroke-linecap="butt"/>`;
    }).join('') +
    `<text x="${C}" y="${C-2}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">${BRL(total===1&&faturamento===0?0:faturamento)}</text>
     <text x="${C}" y="${C+14}" text-anchor="middle" font-size="8.5" fill="var(--ink-faint)">recebido</text>`;

  document.getElementById('donutLegend').innerHTML = Object.entries(methods).map(([k,v])=>`
    <div class="legend-row">
      <span class="legend-dot" style="background:${colors[k]}"></span>
      <span>${k} <span class="legend-sub">(${methodCount[k]} pagto.)</span></span>
      <strong>${BRL(v)}</strong>
    </div>
  `).join('');

  /* ranking clientes */
  const totals = {};
  const counts = {};
  pagos.forEach(a=>{ totals[a.clientId]=(totals[a.clientId]||0)+accountTotal(a); counts[a.clientId]=(counts[a.clientId]||0)+1; });
  const ranking = Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,5);

  document.getElementById('rankingList').innerHTML = ranking.length ? ranking.map(([clientId,total],i)=>{
    const cl = clientById(clientId);
    return `<div class="rank-row">
      <span class="rank-pos">${i+1}</span>
      <div class="rank-name"><strong>${cl.name}</strong><small>${counts[clientId]} conta(s) concluída(s)</small></div>
      <span class="rank-value">${BRL(total)}</span>
    </div>`;
  }).join('') : `<p class="muted">Nenhum pagamento no período selecionado.</p>`;
}

/* ---------------- MODAIS: helpers genéricos ---------------- */
function openModal(el){ el.classList.add('is-open'); paintIcons(el); }
function closeModal(el){ el.classList.remove('is-open'); }
document.querySelectorAll('.modal-overlay').forEach(ov=>{
  ov.addEventListener('click', e=>{ if(e.target===ov) closeModal(ov); });
  ov.querySelectorAll('[data-close]').forEach(b=> b.addEventListener('click', ()=> closeModal(ov)));
});

/* ---------------- SHEET "MAIS" (mobile) ---------------- */
const maisOverlay = document.getElementById('maisOverlay');
document.getElementById('btnMais').addEventListener('click', ()=> maisOverlay.classList.add('is-open'));
maisOverlay.addEventListener('click', e=>{ if(e.target===maisOverlay) closeSheet(); });
function closeSheet(){ maisOverlay.classList.remove('is-open'); }

/* ---------------- SAIR ---------------- */
const modalSair = document.getElementById('modalSair');
document.getElementById('btnSair').addEventListener('click', ()=> openModal(modalSair));
document.getElementById('btnSairMais').addEventListener('click', ()=> { closeSheet(); openModal(modalSair); });
document.getElementById('btnConfirmarSair').addEventListener('click', ()=>{
  closeModal(modalSair);
  showToast('Sessão encerrada. Até logo!', 'exit');
});

/* ---------------- MODO ESCURO ---------------- */
document.getElementById('darkModeToggle').addEventListener('change', e=>{
  document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
});

/* ---------------- NAVEGAÇÃO DE MÊS (Início) ---------------- */
document.getElementById('btnMesAnterior').addEventListener('click', ()=>{
  homeMonth--; if(homeMonth<0){ homeMonth=11; homeYear--; }
  renderInicio();
});
document.getElementById('btnMesProximo').addEventListener('click', (e)=>{
  if(e.currentTarget.disabled) return;
  homeMonth++; if(homeMonth>11){ homeMonth=0; homeYear++; }
  renderInicio();
});
document.getElementById('btnMesAtual').addEventListener('click', ()=>{
  homeMonth = TODAY.getMonth(); homeYear = TODAY.getFullYear();
  renderInicio();
});

/* ---------------- INICIALIZAÇÃO ---------------- */
autoCloseAccounts();
paintIcons();
setupReportFilters();
renderInicio();
renderContas();
renderHistorico();
renderRelatorios();
goTo('inicio');
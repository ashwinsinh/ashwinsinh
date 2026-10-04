const catalogue = {
  'FXKQ25AV16': { capacity: .8, price: 52000, accessories: ['BYKQ63AHW', 'BRC1E63', 'WIRED REMOTE'] },
  'FXKQ32AV16': { capacity: 1.0, price: 55500, accessories: ['BYKQ63AHW', 'BRC1E63', 'WIRED REMOTE'] },
  'FXKQ40AV16': { capacity: 1.3, price: 58500, accessories: ['BYKQ63AHW', 'BRC1E63', 'WIRED REMOTE'] },
  'FXKQ50AV16': { capacity: 1.5, price: 62000, accessories: ['BYKQ63AHW', 'BRC1E63', 'WIRED REMOTE'] },
  'FXKQ63AV16': { capacity: 2.0, price: 71000, accessories: ['BYKQ63AHW', 'BRC1E63', 'WIRED REMOTE'] }
};
let projectType = 'Small Residence', mode = 'smart', floors = [[{name:'Master Bedroom', area:220, height:10},{name:'Living Hall', area:360, height:11}]];
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const modelFor = (area,height) => { const load = area * height / 1800; return Object.keys(catalogue).find(k=>catalogue[k].capacity>=load) || 'FXKQ63AV16'; };

document.querySelectorAll('.project-card').forEach(card=>card.onclick=()=>{document.querySelectorAll('.project-card').forEach(c=>c.classList.remove('selected'));card.classList.add('selected');projectType=card.dataset.type;});
document.querySelectorAll('.mode-card').forEach(card=>card.onclick=()=>{document.querySelectorAll('.mode-card').forEach(c=>c.classList.remove('selected'));card.classList.add('selected');mode=card.dataset.mode;});
document.getElementById('startBtn').onclick=()=>{document.getElementById('planner').classList.remove('hidden');document.getElementById('projectTitle').textContent=`${projectType} Configuration`;renderFloors();document.getElementById('planner').scrollIntoView({behavior:'smooth'});};
document.getElementById('addFloor').onclick=()=>{floors.push([{name:'Bedroom',area:180,height:10}]);renderFloors();};

function renderFloors(){
 const host=document.getElementById('floors'); host.innerHTML='';
 floors.forEach((zones,fi)=>{const floor=document.createElement('div');floor.className='floor';floor.innerHTML=`<div class="floor-head"><input value="${fi?'Floor '+fi:'Ground floor'}" aria-label="Floor name"><button class="add-zone">＋ Add cooling area</button></div><div class="zones"></div>`;floor.querySelector('.add-zone').onclick=()=>{zones.push({name:'New cooling area',area:180,height:10});renderFloors()};const zh=floor.querySelector('.zones');zones.forEach((z,zi)=>zh.appendChild(zoneNode(z,fi,zi)));host.appendChild(floor)}); updateSummary();
}
function zoneNode(z,fi,zi){
 const node=document.createElement('div');node.className='zone';const suggested=z.model||modelFor(z.area,z.height);z.model=suggested;
 node.innerHTML=`<div class="field"><label>Room / area name</label><input value="${z.name}"></div><div class="field"><label>Area (sq.ft.)</label><input type="number" value="${z.area}"></div><div class="field"><label>Height (ft.)</label><input type="number" value="${z.height}"></div><div class="field"><label>${mode==='smart'?'SmartSelect recommendation':'Selected model'}</label><select>${Object.keys(catalogue).map(m=>`<option ${m===suggested?'selected':''}>${m}</option>`).join('')}</select><div class="model-meta">IDU + ${catalogue[suggested].accessories.join(' + ')}</div></div><div class="field"><label>Unit price</label><input type="number" value="${z.price||catalogue[suggested].price}"></div><button class="remove" title="Remove">×</button>`;
 const inputs=node.querySelectorAll('input'),sel=node.querySelector('select');inputs[0].oninput=e=>z.name=e.target.value;inputs[1].onchange=e=>{z.area=+e.target.value;if(mode==='smart')z.model=modelFor(z.area,z.height);renderFloors()};inputs[2].onchange=e=>{z.height=+e.target.value;if(mode==='smart')z.model=modelFor(z.area,z.height);renderFloors()};inputs[3].onchange=e=>{z.price=+e.target.value;updateSummary()};sel.onchange=e=>{z.model=e.target.value;z.price=catalogue[z.model].price;renderFloors()};node.querySelector('.remove').onclick=()=>{floors[fi].splice(zi,1);renderFloors()};return node;
}
function allZones(){return floors.flat()}
function equipment(){return allZones().reduce((s,z)=>s+(z.price||catalogue[z.model].price),0)}
function updateSummary(){document.getElementById('unitCount').textContent=`${allZones().length} units`;document.getElementById('equipmentTotal').textContent=money(equipment());document.getElementById('totalLoad').textContent=`${allZones().reduce((s,z)=>s+catalogue[z.model].capacity,0).toFixed(2)} TR`;}
document.getElementById('reviewBtn').onclick=()=>{renderQuote();document.getElementById('quote').classList.remove('hidden');document.getElementById('quote').scrollIntoView({behavior:'smooth'});};
function renderQuote(){
 document.getElementById('quoteProject').textContent=`${projectType} · ${mode==='smart'?'SmartSelect™ engineered':'Manually configured'} solution`;const rows=document.getElementById('quoteRows');rows.innerHTML='';allZones().forEach((z,i)=>{const c=catalogue[z.model];const tr=document.createElement('tr');tr.innerHTML=`<td><b>${z.name}</b><small>${z.area} sq.ft. · ${z.height} ft height · ${c.capacity.toFixed(1)} TR</small></td><td><select data-i="${i}">${Object.keys(catalogue).map(m=>`<option ${m===z.model?'selected':''}>${m}</option>`).join('')}</select><small>${c.accessories.join(' + ')}</small></td><td>1</td><td><input data-price="${i}" type="number" value="${z.price||c.price}"></td><td><b>${money(z.price||c.price)}</b></td>`;rows.appendChild(tr)});rows.querySelectorAll('select').forEach(s=>s.onchange=e=>{const z=allZones()[+e.target.dataset.i];z.model=e.target.value;z.price=catalogue[z.model].price;renderQuote()});rows.querySelectorAll('[data-price]').forEach(inp=>inp.onchange=e=>{allZones()[+e.target.dataset.price].price=+e.target.value;renderQuote()});updateTotals();
}
function updateTotals(){const sub=equipment(),services=+document.getElementById('pipingPrice').value + +document.getElementById('installPrice').value,tax=(sub+services)*.18;document.getElementById('subtotal').textContent=money(sub);document.getElementById('serviceTotal').textContent=money(services);document.getElementById('taxTotal').textContent=money(tax);document.getElementById('grandTotal').textContent=money(sub+services+tax)}
document.getElementById('pipingPrice').oninput=updateTotals;document.getElementById('installPrice').oninput=updateTotals;

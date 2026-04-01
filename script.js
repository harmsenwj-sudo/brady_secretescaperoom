
let timeLeft = 30 * 60;
let timerInterval = null;
let current = 0;

const puzzles = [
    {id:'p1',type:'code',title:'🧗 Klimroute',prompt:'Rummy009 klautert langs een steile rotswand. Hij stijgt eerst 1,7 meter, glijdt daarna 0,4 meter terug, vindt opnieuw grip en klimt 2,3 meter omhoog — om tenslotte nog eens 0,6 meter te verliezen. Hoeveel decimeters heeft hij per saldo afgelegd?',answer:'30'},
    {id:'p2',type:'choice',title:'🥩 T-bone',prompt:'Waar bevindt zich de T-bone?',options:['In de borst','In de schouder','In de lende (short loin)','In de nek'],correct:2},
    {id:'p3',type:'order',title:'🎣 De Vangst',prompt:'Zet in volgorde: vul het juiste getal in (1–5)',items:['Binnenhalen','Wachten','Aanslaan','Uitgooien','Dobber verdwijnt'],correct:['Uitgooien','Wachten','Dobber verdwijnt','Aanslaan','Binnenhalen']},
    {id:'p4',type:'text',title:'Raadsel',prompt:'Ik heb een arm die kan grijpen en een trompet die geen muziek maakt. Wie ben ik?',answer:'olifant'},
    {id:'p5',type:'choice',title:'💖 Eva-vraag',prompt:'Wat viel Brady als eerste op aan Eva?',options:['Haar intelligentie','Haar 🍑','Haar spirituele energie','Haar oog voor detail'],correct:1},
    {id:'p6',type:'choice',title:'🌴 Californication',prompt:'Welke thematische betekenis wordt vaak gekoppeld aan “Californication”?',options:['Kritiek op Hollywood en droomvervorming','Autobiografisch verhaal','Metafoor voor natuurbranden','Religieuze beweging'],correct:0},
    {id:'p7',type:'choice',title:'🧠 Begrijpend Lezen – Relaties & SOA’s',prompt:'Brady en Eva hebben een exclusieve relatie sinds vier maanden. Brady had wisselende contacten, Eva niet. Wie moet zich laten testen?',options:['Alleen Eva','Alleen Brady','Beide partners','Niemand'],correct:2},
    {id:'p9',type:'code',title:'⚡ Elektriciteit – P = U × I',prompt:'In het Stedin-lab test Brady een apparaat op 10 volt en 2,0 ampère. Wat is het vermogen in watt?',answer:'20'}
];

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('timer').style.display = 'block';
    startTimer();
    render();
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer').innerText = `${m}:${s.toString().padStart(2,'0')}`;
}

function gameOver() {
    document.getElementById('game-container').innerHTML = `<div class='card'><h2>⏳ Tijd is om!</h2><p>Je hebt het niet gehaald…</p></div>`;
}

function validateOrderInputs() {
    const inputs=[...document.querySelectorAll('.order-input')];
    const values=inputs.map(i=>parseInt(i.value));
    inputs.forEach(i=>i.classList.remove('ok','error','duplicate'));
    values.forEach((v,i)=>{ if(isNaN(v)||v<1||v>inputs.length) inputs[i].classList.add('error'); });
    const counts={}; values.forEach(v=>{ if(!isNaN(v)) counts[v]=(counts[v]||0)+1 });
    inputs.forEach((inp,i)=>{ const v=values[i]; if(!isNaN(v)&&counts[v]>1) inp.classList.add('duplicate'); });
    inputs.forEach((inp,i)=>{ const v=values[i]; if(!isNaN(v)&&v>=1&&v<=inputs.length&&counts[v]===1) inp.classList.add('ok'); });
}

function render(){
    const p=puzzles[current];
    document.getElementById('progress-bar').style.width=(current/puzzles.length*100)+'%';
    let h=`<div class='card'><h3>${p.title}</h3><p>${p.prompt}</p>`;

    if(p.type==='code'||p.type==='text'){
        h+=`<input id='ans'><button class='btn btn-primary' onclick='check()'>Controleer</button>`;
    }
    if(p.type==='choice'){
        p.options.forEach((o,i)=>{ h+=`<div class='option' onclick='check(${i})'>${o}</div>`; });
    }
    if(p.type==='order'){
        h+='<div>'; p.items.forEach((item,i)=>{
            h+=`<div class='option'>${item}<input class='order-input' id='ord${i}' type='number' min='1' max='${p.items.length}' oninput='validateOrderInputs()'></div>`;
        }); h+='</div><button class="btn btn-primary" onclick="check()">Controleer</button>';
    }

    h+='</div>';
    document.getElementById('card-container').innerHTML=h;
}

function check(v){
    const p=puzzles[current];
    let ok=false;

    if(p.type==='code'||p.type==='text'){
        ok = document.getElementById('ans').value.trim().toLowerCase() === p.answer.toLowerCase();
    }
    if(p.type==='choice') ok=(v===p.correct);

    if(p.type==='order'){
        const pos=[]; const order=[];
        for(let i=0;i<p.items.length;i++){
            const num=parseInt(document.getElementById('ord'+i).value);
            if(isNaN(num)||num<1||num>p.items.length){ alert('Gebruik cijfers tussen 1-5'); return; }
            pos.push(num); order.push({item:p.items[i],pos:num});
        }
        if(new Set(pos).size!==pos.length){ alert('Alle cijfers moeten uniek zijn'); return; }
        order.sort((a,b)=>a.pos-b.pos);
        ok=JSON.stringify(order.map(e=>e.item))===JSON.stringify(p.correct);
    }

    if(ok){ current++; if(current<puzzles.length) render(); else finale(); }
    else alert('Niet goed, probeer opnieuw!');
}

function finale(){
    document.getElementById('card-container').innerHTML = `
    <div class='card'><h3>🎉 Finale</h3><p>Je hebt gewonnen!</p>
    <a href='https://maps.app.goo.gl/nzQGDh6HcCBheRLR6'>Volgende locatie</a></div>`;
}

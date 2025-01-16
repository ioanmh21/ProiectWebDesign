//meniu joc2
const bs=document.getElementById('bs');
bs.addEventListener('mouseenter', function() {
    bs.style.transform = 'scale(1.07)';
    bs.style.transition = 'transform 0.3s ease';
    bs.style.backgroundColor = '#4CAF50';
});
bs.addEventListener('mouseleave', function() {
    bs.style.transform = 'scale(1)';
    bs.style.backgroundColor = 'lightgreen';
});
//creare matrice
const matrix = document.getElementById('matrix');
let l = 20;
for (let i = 0; i < l; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < l; j++) {
        const cell = document.createElement('td');

        cell.setAttribute('linie', i);
        cell.setAttribute('coloana', j);

        row.appendChild(cell);
    }
    matrix.appendChild(row);
}
const cells = matrix.querySelectorAll('td');


const travel=document.getElementById('game-button');
travel.addEventListener('mouseenter', function() {
    bs.style.transform = 'scale(1.07)';
    bs.style.transition = 'transform 0.3s ease';
    bs.style.backgroundColor = '#4CAF50';
});
travel.addEventListener('mouseleave', function() {
    bs.style.transform = 'scale(1)';
    bs.style.backgroundColor = 'lightgreen';
});

//functii ajutatoare
function redToBlueColor(value){
    if(value==-1)
            return '#05198f';
    if(value==1)
            return '#6c0d0d';
    if (value < 0) {
        const intensity = value*(-1);
        const r = Math.floor(255 * intensity*5);
        const g = Math.floor(255 * intensity*5);
        const b = 255;
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        const intensity = value;
        const r = 255;
        const g = Math.floor(255 * intensity*5);
        const b = Math.floor(255 * intensity*5);
        return `rgb(${r}, ${g}, ${b})`;
    }
}
function sqrtsumquad(i, j, x, y) {
    return Math.sqrt((i - x) * (i - x) + (j - y) * (j - y));
}
//functii care modifica variabilele
let points=[],mat=[];
let n,hot_points,level;
let misses=0,bigtries=3;
//1.puncte,matrice valori
function generatePoints() {
    points=[];
    while (points.length < n) {
        let x, y;
        do {
            x = Math.floor(Math.random() * l);
            y = Math.floor(Math.random() * l);
        } while (points.some(([px, py]) => Math.abs(px - x) + Math.abs(py - y) < 4));
        points.push([x, y]);
    }
}

function mat_real_values(){
    mat=[];
    for (let i = 0; i < l; i++){
        let row = [];
        for (let j = 0; j < l; j++){
            let distance,distanceh=30,distancec=30;
            for(let k=0;k<hot_points;k++){
                distance=sqrtsumquad(i,j,points[k][0],points[k][1]);
                distanceh=Math.min(distanceh,distance);
            }
            for(let k=hot_points;k<n;k++){
                distance=sqrtsumquad(i,j,points[k][0],points[k][1]);
                distancec=Math.min(distancec,distance);
            }

            let z = 1;
            if (distanceh >= distancec)
                z = -1;
            if (distancec * distanceh != 0)
                row.push(z * Math.min(distancec, distanceh));
            else row.push(z * 30);
        }
        mat.push(row);
    }
}

function normalize() {
    cells.forEach(cell => {
        let i=cell.getAttribute('linie');
        let j=cell.getAttribute('coloana');
        mat[i][j] = mat[i][j] / 30;
    });
}

function coloredcell(i,j,cell){
    if (Math.abs(mat[i][j]) < 1/(level+5)+0.02 || Math.abs(mat[i][j])==1)
        cell.style.backgroundColor=redToBlueColor(mat[i][j]);
    else cell.style.backgroundColor='#c8d0f8';
}
function reveal(){
    for (let i = 0; i < l; i++)
        for (let j = 0; j < l; j++) {
            coloredcell(i,j,cells[i*l+j]);
        }
}
function hint(x,y){
    const directions = [[0, 0],[-1, 0],[1, 0],[0, -1],[0, 1],
                        [-1, -1],[-1, 1],[1, -1],[1, 1],
                        [0,2],[0,-2],[2,0],[-2,0]];

    directions.forEach(([dx, dy]) => {
        const newRow = Number(x) + dx;
        const newCol = Number(y) + dy;
        if (newRow >= 0 && newRow < 20 && newCol >= 0 && newCol < 20) {
            
            cells[newRow*l+newCol].style.backgroundColor=coloredcell(newRow,newCol,cells[newRow*l+newCol]);
        }
    });
}

function removeListeners() {
    cells.forEach(cell => {
      cell.removeEventListener('click', cell_role);
    });
  }

function cell_role(event){
    const cell=event.target;
    let ii=cell.getAttribute('linie');
    let jj=cell.getAttribute('coloana');

    coloredcell(ii,jj,cell);

    const modeToggle = document.getElementById("modeToggle");
    if(modeToggle.checked){
        hint(ii,jj);
        bigtries-=1;
        document.querySelector('#tries-left').innerHTML=`${bigtries} left`;
        if(bigtries==0){
            document.querySelector('#modeToggle').checked=false;
            document.querySelector('#modeToggle').disabled = true;
        }
    }
    let ok=0;

    points.forEach(pair => {
        if(pair[0]==ii && pair[1]==jj)
            ok=1;
    }); 
    if(ok){
        reveal();
        for(let i=0;i<n;i++)
            if(ii==points[i][0] && jj==points[i][1])
                index=i;
        if(index<hot_points){
            misses+=1;
            document.querySelector('#misses').innerHTML=`${misses} attempts`;

            document.querySelector('#outcome').classList.add('win-effect');
            document.querySelector('#outcome').innerHTML=`WIN`;
            document.querySelector('#win-sound').play();
            if(level<=9){
                travel.innerHTML=`Level ${level+1}`;
                level+=1;
                travel.addEventListener('click',build_mat);
            }
            else{
                travel.innerHTML='Meniu';
                travel.removeEventListener('click',build_mat);
                travel.addEventListener('click',() => {
                    window.location.href = 'proiect.html';
                });
            }
        }
        else{
            misses+=1;
            document.querySelector('#misses').innerHTML=`${misses} attempts`;

            document.querySelector('#outcome').innerHTML=`FAIL`;
            document.querySelector('#lose').playbackRate=1.5;
            document.querySelector('#lose').play();
            travel.innerHTML=`Try again!`;
            travel.addEventListener('click',build_mat);
        } 
        travel.style.display='flex';
        removeListeners();
    }
    else{
        misses+=1;
        if(misses==10){
            reveal();
            document.querySelector('#outcome').innerHTML=`FAIL`;
            travel.innerHTML=`Try again!`;
            travel.style.display='flex';
            travel.addEventListener('click',build_mat);
            document.querySelector('#lose').playbackRate=1.5;
            document.querySelector('#lose').play();
            removeListeners();
        }
        document.querySelector('#misses').innerHTML=`${misses} attempts`;
    }  
}

function build_mat(){
    travel.style.display='none';
    document.getElementById('nivel').innerHTML=`Level ${level}`;
    document.querySelector('#modeToggle').checked=true;
    document.querySelector('#modeToggle').disabled = false;

    hot_points=Math.floor(level/2.5)+1;
    n=level*3+hot_points;misses=0;bigtries=3;

    document.querySelector('#tries-left').innerHTML=`${bigtries} left`;
    document.querySelector('#misses').innerHTML=`${misses} attempts`;
    document.querySelector('#outcome').innerHTML=``;

    document.querySelector('#outcome').classList.remove('win-effect');

    generatePoints();
    mat_real_values();
    normalize();
    console.log(mat);

    for (let i = 0; i < l; i++)
        for (let j = 0; j < l; j++){
            cells[i*l+j].style.backgroundColor = '#f9ffc2';
        }
    
    for (let i = 0; i < l; i++)
        for (let j = 0; j < l; j++)
            cells[i*l+j].addEventListener('click', cell_role);
}

bs.addEventListener('click',begin);
function begin(){
    const start_menu=document.getElementById('start-menu');
    start_menu.style.display='none';
    for (let i = 0; i < l; i++)
        for (let j = 0; j < l; j++){
            cells[i*l+j].style.backgroundColor = '#f9ffc2';
        }
            
    const container=document.getElementById('container');
    container.style.display='flex';
    container.style.flexDirection='center';

    travel.style.display='none';
    
    level=0;
    
    build_mat();
}
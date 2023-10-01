let doc = document;
let area = doc.querySelector(".area");
let i_ai = 0
let i_your = 0
if (localStorage.getItem('you') != null){
    i_your = parseFloat(localStorage.getItem('you'))
}
if (localStorage.getItem('ai') != null){
    i_ai = parseFloat(localStorage.getItem('ai'))
}
let nx = doc.querySelector('.nx').innerHTML = i_your
let no = doc.querySelector('.no').innerHTML = i_ai
for (let i = 1; i <= 9; i++) {
    area.innerHTML += `<div class="cell" pos="${i}"></div>`;
}
let cell = doc.querySelectorAll('.cell');
for (let i = 0; i < cell.length; i++) {
    cell[i].addEventListener('click', cellClick, false);
}
let player = '<p class="x">x</p>';
let opponent = '<p class="o">o</p>';
let winIndex = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
function cellClick() {
    if (!this.innerHTML) {
        this.innerHTML = player;
        if (checkWin(player)) {
            restart("Winner: " + "You");
            i_your+=1
            let n = doc.querySelector('.nx').innerHTML = i_your
            localStorage.setItem('you', `${i_your}`)
        } else if (checkDraw()) {
            restart("Draw");
        } else {
            opponentMove();
        }
    } else {
        alert('Occupied');
    }
    console.log(player);
}

function opponentMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < cell.length; i++) {
        if (!cell[i].innerHTML) {
            cell[i].innerHTML = opponent;
            let score = minimax(cell, 0, false);
            cell[i].innerHTML = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    cell[move].innerHTML = opponent;
    if (checkWin(opponent)) {
        restart("Winner: " + "AI");
        i_ai +=1 
        let n = doc.querySelector('.no').innerHTML = i_ai
        localStorage.setItem('ai', `${i_ai}`)
    } else if (checkDraw()) {
        restart("Draw");
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(player)) {
        return -1;
    } else if (checkWin(opponent)) {
        return 1;
    } else if (checkDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < cell.length; i++) {
            if (!cell[i].innerHTML) {
                cell[i].innerHTML = opponent;
                let score = minimax(cell, depth + 1, false);
                cell[i].innerHTML = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cell.length; i++) {
            if (!cell[i].innerHTML) {
                cell[i].innerHTML = player;
                let score = minimax(cell, depth + 1, true);
                cell[i].innerHTML = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(player) {
    let data = [];
    for (let i in cell) {
        if (cell[i].innerHTML == player) {
            data.push(parseInt(cell[i].getAttribute('pos')));
        }
    }
    for (let i in winIndex) {
        let win = true;
        for (let j in winIndex[i]) {
            let id = winIndex[i][j];
            let ind = data.indexOf(id);
            if (ind == -1) {
                win = false;
            }
        }
        if (win) return true;
    }
    return false;
}

function checkDraw() {
    for (let i in cell) {
        if (cell[i].innerHTML == '') {
            return false;
        }
    }
    return true;
}
let btn = doc.querySelector('.new')
let modal = doc.querySelector('.modal')
let black = doc.querySelector('.black-block')
function restart(text) {
    let result = doc.querySelector('.result').innerHTML = text
    modal.style.display = "flex"
    black.style.display = 'block'
}
btn.onclick = () => {
    modal.style.display = "none"
    black.style.display = 'none'
    for (let i = 0; i < cell.length; i++) {
        cell[i].innerHTML = '';
    }
}
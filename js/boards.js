"use strict";

const boards = document.getElementsByClassName("board");
console.log(boards.length);
console.log(boards);

let boardId = 0;

for (const board of boards) {
    console.log(board);
    board.setAttribute("id", "board" + boardId);

    boardId++;
    for (let i = 0; i <= 11; i++) {
        // console.log(i);
        for (let j = 0; j <= 11; j++) {
            const cell = document.createElement("div");
            const coordX = paddy(i, 2);
            const coordY = paddy(j, 2);
            // console.log(coordX, coordY);
            if (i !== 0 && i !== 11 && j !== 0 && j !== 11) {
                cell.innerHTML += coordX + coordY;
            }

            board.appendChild(cell);
            if (i == 0 && j >= 1 && j <= 10) {
                cell.innerHTML = j;
            }
            if (j == 0 && i >= 1 && i <= 10) {
                cell.innerHTML = i;
            }
        }
    }
    // for (let i = 0; i <= 10; i++) {
    //     const element = array[1];
    // }
}

function paddy(num, padlen, padchar) {
    let pad_char = typeof padchar !== "undefined" ? padchar : "0";
    const pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}

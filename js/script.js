"use strict";

// console.log(
//   Array(8).fill(0).map((e,i)=>i+1)
// );


// ********* REMOVE!!!!
// const probe_arr = [100, 200, 3, 4];

// for (let index = 0; index < 10; index++) {
// 	console.log("probe_arr");
//     console.log(probe_arr);
// 	arrayUniqFill(probe_arr);
// }

// arrayUniqFill(probe_arr);

// console.log("probe_arr");
// console.log(probe_arr);
// ********* REMOVE!!!!


// Количество направлений, по которым может располагаться корабль: 1 - от головы на север, далее - по часовой стрелке.
const DIRECTIONS = 4;

// Определение границ игрового поля.
const BORDER = 8;

// Символ пустой клетки для начального заполнения игрового поля
const EMPTY = 0;

// Символ для заполнения сита поиска корабля
const SIEVENUMBER = 1;

// Переменная сокрытия кораблей
const HIDESHIP = false;

// Размер массива игрового поля - 10х10 и ограничение края единицами. Итоговый размер 12х12.
// Не очень хороший пример для тестирования, но должен срабатывать вплоть до помещения всех однопалубных кораблей.
// В итеративном прогоне от четырехпалубника до последнего однопалубника на изначатьно пустом поле, матрица заполнения, не позволяющая встать кораблям ближе,
// чем возможно по правилам игры, равна 3 х (decks + 2). Она не даст хвосту следующего по списку корабля встать на невозможное место. 
const WORLDSIZE = 10 + 1 + 1;

const computerWorld = Create2dArray(WORLDSIZE, WORLDSIZE)
                    // // Массив для тестового прогона
                    //                    {
                    //                      { 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
                    //                      { 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1},
                    //                      { 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1},
                    //                      { 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1},
                    //                      { 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
                    //                      { 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
                    //                      { 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1},
                    //                      { 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1},
                    //                      { 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
                    //                      { 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1},
                    //                      { 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1},
                    //                      { 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}
                    //                    }
                    ;

const playerWorld = Create2dArray(WORLDSIZE, WORLDSIZE);



// Массив кораблей. [0] - x, [1] - y; [2] - direction; [3] - decks; [4] - status: n = 0 - destroyed, n = [3] — new ship, other n — wounded 
const squadronComputer = [
  [0, 0, 0, 4, 4],
  [0, 0, 0, 3, 3], [0, 0, 0, 3, 3],
  [0, 0, 0, 2, 2], [0, 0, 0, 2, 2], [0, 0, 0, 2, 2],
  [0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1]
];

const squadronPlayer = [
  [0, 0, 0, 4, 4],
  [0, 0, 0, 3, 3], [0, 0, 0, 3, 3],
  [0, 0, 0, 2, 2], [0, 0, 0, 2, 2], [0, 0, 0, 2, 2],
  [0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1]
];


array2dBorder(computerWorld, BORDER);
array2dBorder(playerWorld, BORDER);

// +++ Отладочная информация +++
// console.log('Map with border. computerWorld');
// console.table(computerWorld);

// +++ Отладочная информация +++
// console.log('Map with border. playerWorld');
// console.table(playerWorld);

const emptyCellsCoord = GetEmptyCellCoords(computerWorld);
computerWorld[2][1] = 88;
computerWorld[2][3] = 88;



// CreateMap(computerWorld, squadronComputer);

// +++ Отладочная информация +++
console.log('Map with border. computerWorld');
console.table(computerWorld);

const simpleMap = Map_0_1_Copy(computerWorld);
console.table("simpleMap");
console.table(simpleMap);

let logical = TryToPlaceShip(simpleMap, emptyCellsCoord, squadronComputer[0]);
console.table("logical");
console.table(logical);


// CreateMap(playerWorld, squadronPlayer);

// +++ Отладочная информация +++
// console.log('Map with border. playerWorld');
// console.table(playerWorld);


// ================================================================

// -------------------- Создание игрового поля для игрока или компьютера
function CreateMap(gamemap, squadron)
{

  // console.table(gamemap);

  // индекс корабля
  let shipIndex = 10;

  for (let element of squadron)
  {
    ShipPlace(gamemap, element, shipIndex);
    FillCellsAroundShip(gamemap, element, SIEVENUMBER, EMPTY);

    shipIndex++;
  }

  // +++++++++++++++++++ Отладочная информация +++++++++++++++++++++++
  System.Console.WriteLine("All ships placed on map");

  ChangeNumberIn2dArray(gamemap, SIEVENUMBER, EMPTY);
}

// --------- square border in array fill with NUMBER -----
function array2dBorder(arr2d, number)
{
  
  
  for (let i = 0; i < arr2d.length; i++)
  {
    arr2d[i][0] = number;
    arr2d[i][arr2d[0].length - 1] = number;
  }

  for (let i = 0; i < arr2d.length; i++)
  {
    for (let j = 1; j < arr2d[0].length - 1; j++)
    {
      if (i === 0 || i === arr2d.length - 1)
      {
        arr2d[i][j] = number;
      }
    }
  }
  return arr2d;
}

// --------------------------- New Year 2023 - SHIP PLACE
function Old____ShipPlace(gamemap, ship, shipIndex)
{
  let decks = ship[3];

  let emptyCells = countCellsWithNumber(gamemap, EMPTY);

  while (emptyCells > 0)
  {
    let randomCell = GetRandomFrom(1, emptyCells);

    // +++ Отладочная информация +++
    console.log("emptyCells ");
    console.log(emptyCells);
    console.log("randomCell ");
    console.log(randomCell);

    let xAnDy = randomCellXY(randomCell, gamemap, EMPTY);

    let localY = xAnDy / 100;
    let localX = xAnDy % 100;

    map[localY, localX] = 7;

    const directionArray = [DIRECTIONS];
    arrayUniqFill(directionArray);

    // После генерации массива из четырех случайных направлений 
    // итерируемся по ним в попытке поставить корабль на игровое поле
    for (let item of directionArray)
    {
      const dXdYupperLevel = [GetDirection(item)];

      // получаем приращение координат от головы корабля
      let dXupperLevel = dXdYupperLevel[0];
      let dYupperLevel = dXdYupperLevel[1];

      // получаем координату последней палубы корабля
      let tailX = localX + (decks - 1) * dXupperLevel;
      let tailY = localY + (decks - 1) * dYupperLevel;


      // Если корабль однопалубный или хвост корабля в пределах игрового поля, 
      // и эта клетка свободна - Ура. Ship on map
      if (
        decks == 1 ||
        tailX > 0 &&
        tailX < gamemap.length - 1 &&
        tailY > 0 &&
        tailY < gamemap[0].length - 1 &&
        gamemap[tailY, tailX] == 0
        )
      {
        // +++ Отладочная информация +++
        System.Console.WriteLine("Ship on map");
        System.Console.WriteLine();

        ship[0] = localX;
        ship[1] = localY;
        ship[2] = item;

        ShipNumbersOnMap(gamemap, ship, shipIndex);
        return;
      }
    }
    emptyCells--;
  }

  // System.Console.WriteLine("Epic fail!!!");

}

// --------------------------- fill cell around ship
function FillCellsAroundShip(gamemap, ship, fillNumber, numberToChange)
{
  let headDeckX = ship[0];
  let headDeckY = ship[1];

  const dXdY = [GetDirection(ship[2])];
  let dX = dXdY[0];
  let dY = dXdY[1];

  for (let decks = 1; decks <= ship[3]; decks++)
  {
    for (let i = headDeckX - 1; i <= headDeckX + 1; i++)
    {
      for (let j = headDeckY - 1; j <= headDeckY + 1; j++)
      {
        // j - Y, i - X

        if (gamemap[i][j] === numberToChange)
        {
          gamemap[i][j] = fillNumber;
        }
      }
    }
    headDeckX = headDeckX + dX;
    headDeckY = headDeckY + dY;
  }
}

// ------------------- Очистка карты от мусора
function ChangeNumberIn2dArray(gamemap, findNumber, changeNumber)
{
    gamemap.forEach(element => {
        element == findNumber ? changeNumber : element; 
    });
}

// ------------ count of cells contain NUMBER ---
function countCellsWithNumber(arr, numberToFind)
{
  return [].concat(...arr).filter(x => x === numberToFind).length;
}

// ------- RANDOM NUMBER from - to -------------------
function GetRandomFrom(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ------------ Get random cell X, Y ----
function randomCell_X_Y_Arr(number, arr, numberToFind)
{
  let count = 0;
  let localxAnDy = [-1, -1];
  for (let i = 1; i < arr.length - 1; i++)
  {
    for (let j = 1; j < arr[0].length - 1; j++)
    {
      if (arr[i][j] == numberToFind)
      {
        count++;
        if (count === number)
        {
          localxAnDy[0] = j;
          localxAnDy[1] = i;
          return localxAnDy;
        }
      }
    }
  }
  return localxAnDy;
}

// ------------ fill Arr with unique numbers from 1 to array.length
function arrayUniqFill(arr)
{
	for (let index = 0; index < arr.length; index++) {
		arr[index] = index + 1;
	}
	
	// console.log("arr in");
	// console.log(arr);
	
	shuffle(arr);
	
	// console.log("arr out");
	// console.log(arr);
}

// ------------ shuffle Arr
function shuffle(arr){
	let j, temp;
	for(let i = arr.length - 1; i > 0; i--){
		// j = Math.floor(Math.random()*(i + 1));
		j = GetRandomFrom(0, i);
			// console.log("JJJJ");
			// console.log(j);
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
			// console.log(arr);
	}
}

// ------------ Get direction -----------
function GetDirection(number)
{
  const dXdY = [2];
  let dX = 0;
  let dY = 0;

  if (number === 1)
  {
    dY = -1;
  }

  if (number === 2)
  {
    dX = 1;
  }

  if (number === 3)
  {
    dY = 1;
  }

  if (number === 4)
  {
    dX = -1;
  }

  dXdY[0] = dX;
  dXdY[1] = dY;

  return dXdY;
}

// --------------------------- Функция заполнения клеток кораблей их номерами
function ShipNumbersOnMap(gamemap, ship, shipIndex)
{
  let localX = ship[0];
  let localY = ship[1];
  let direction = ship[2];
  let decks = ship[3];

  gamemap[localY][localX] = shipIndex;

  if (decks > 1)
  {
    const dXdYupperLevel = GetDirection(direction);

    // получаем приращение координат от головы корабля
    let dXupperLevel = dXdYupperLevel[0];
    let dYupperLevel = dXdYupperLevel[1];

    for (decksIndex = 1; decksIndex < decks; decksIndex++)
    {
      gamemap[localY + decksIndex * dYupperLevel][localX + decksIndex * dXupperLevel] = shipIndex;
    }
  }
}

// ------------------------- Create 2d array
function Create2dArray(rows, columns) 
{
  const arr = Array(rows).fill().map(() => Array(columns).fill(EMPTY));
  return arr;
}


// --------------------------- New Year 2023 - SHIP PLACE
function GetEmptyCellCoords(gamemap)
// Получаем карту
// Считаем пустые клетки
// Берем рэндом пустую клетку
// Получаем координаты рэндом пустой
{
  let emptyCells = countCellsWithNumber(gamemap, EMPTY);
  let randomCell = GetRandomFrom(1, emptyCells);




    // +++ Отладочная информация +++
    console.log("emptyCells ");
    console.log(emptyCells);
    console.log("randomCell ");
    console.log(randomCell);

    let xAnDy = randomCell_X_Y_Arr(randomCell, gamemap, EMPTY);
    console.log("X ");
    console.log(xAnDy[0]);
    console.log("Y ");
    console.log(xAnDy[1]);
    return xAnDy;

  }


// --------------------------- Map_0_1_Copy - simple map from game map
function Map_0_1_Copy(gamemap)
{
  const simpleMap = Create2dArray(WORLDSIZE, WORLDSIZE);
  for (let i = 0; i < WORLDSIZE; i++) {
    for (let j = 0; j < WORLDSIZE; j++) {
      if (gamemap[i][j] != 0) {
        simpleMap[i][j] = 1;
      }
    }
  }
  return simpleMap;
}

// ----- Try to place Ship
function TryToPlaceShip(simpleMap, coords, ship) {
  let decks = ship[3];
  let flag = 0;
  const directionArray = new Array(DIRECTIONS);
  arrayUniqFill(directionArray);
  console.log("directionArray");
  console.log(directionArray);
  for (let index = 0; index < directionArray.length; index++) {
    let freeCellSum = 0;
    let dXdY = GetDirection(directionArray[index]);

    for (let deckIndex = 1; deckIndex < decks; deckIndex++) {
      freeCellSum = freeCellSum + simpleMap[coords[0] + dXdY[1] * deckIndex][coords[1] + dXdY[0] * deckIndex];
      // ---------- отладка
      console.log("coords[0] + dXdY[1] * deckIndex");
      console.log(coords[0] + dXdY[1] * deckIndex);
      console.log("coords[1] + dXdY[0] * deckIndex");
      console.log(coords[1] + dXdY[0] * deckIndex);
      simpleMap[coords[0] + dXdY[1] * deckIndex][coords[1] + dXdY[0] * deckIndex] = 777;
      simpleMap[coords[0]][coords[1]] = 8;
      // ---------- отладка
      if (freeCellSum > 0) {
        console.log("EPIC FAIL!!!");
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! START HERE!!!
        break;
      }
    }
    console.table(simpleMap);
    return flag;
  }
}

"use strict";

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
const xWORLDSIZE = 10 + 1 + 1;
const yWORLDSIZE = 5 + 1 + 1;

const computerWorld = Create2dArray(yWORLDSIZE, xWORLDSIZE)
// // Массив для тестового прогона
				// const testWorld = [
				// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				// 	[ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
				// 	[ 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
				// 	[ 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
				// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				// 	[ 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
				// 	[ 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
				// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				// 	[ 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
				// 	[ 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
				// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				// ];
										;

console.table(computerWorld);

const playerWorld = Create2dArray(yWORLDSIZE, xWORLDSIZE);

// Массив кораблей. [0] - x, [1] - y; [2] - direction; [3] - decks; [4] - status: n = 0 - destroyed, n = [3] — new ship, other n — wounded 
const COORD_X = 0;
const COORD_Y = 1;
const DIRECT = 2;
const DECKS = 3;
const STATUS = 4;
 
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

// const squadronTest = [
// 	[0, 0, 0, 4, 4],
// 	[0, 0, 0, 3, 3], [0, 0, 0, 3, 3],
// 	[0, 0, 0, 2, 2], [0, 0, 0, 2, 2], [0, 0, 0, 2, 2],
// 	[0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1]
// ];

// // ---- TEST
// const testWorld = [
// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// 	[ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
// 	[ 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
// 	[ 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// 	[ 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
// 	[ 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// 	[ 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
// 	[ 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
// 	[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// ];


// console.table(testWorld);
// ShipPlacing(testWorld, squadronTest);

// %%%%%%%%%%%%%  START

array2dBorder(computerWorld, BORDER);
array2dBorder(playerWorld, BORDER);

ShipPlacing(computerWorld, squadronComputer);
ShipPlacing(playerWorld, squadronPlayer);
console.log("computerWorld");
console.table(computerWorld);
console.log("playerWorld");
console.table(playerWorld);
MapCleanUp(playerWorld, DIRECTIONS, EMPTY);
console.log("playerWorld");
console.table(playerWorld);

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
	// Нет смысла возвращать массив
	// return arr2d;
}

// ------------ count of cells contain NUMBER ---
function countCellsWithNumber(arr, numberToFind)
{
	return [].concat(...arr).filter(x => x === numberToFind).length;
}

// --------------------------- New Year 2023 - SHIP PLACE
function GetEmptyCellCoords(gamemap)
{
	let emptyCells = countCellsWithNumber(gamemap, EMPTY);
	let randomCell = GetRandomFrom(1, emptyCells);
	let xAnDy = randomCell_X_Y_Arr(randomCell, gamemap, EMPTY);
	return xAnDy;
}

// --------------------------- Map_0_1_Copy - simple map from game map
function Map_0_1_Copy(gamemap)
{
	// Отладочные строки
	console.log("GAMEMAP");
	console.table(gamemap);
	
	const simpleMap = Create2dArray(yWORLDSIZE, xWORLDSIZE);
	for (let i = 0; i < simpleMap.length; i++) {
		for (let j = 0; j < simpleMap[0].length; j++) {
			if (gamemap[i][j] != 0) {
				simpleMap[i][j] = 1;
			}
		}
	}
	
	// Отладочные строки
	console.log("simpleMAP");
	console.table(simpleMap);
	
	return simpleMap;
}

// ----- Try to place Ship
function TryToPlaceShip(simpleMap, coords, ship) {
	let flag = 1;
	let decks = ship[DECKS];
	if (decks == 1) {
		SetShipCoordDirection(ship, coords[COORD_X], coords[COORD_Y], STATUS);
		// console.log("ONEDECKER placed");
		// console.log(ship);
		return flag;
	}
	const directionArray = new Array(DIRECTIONS);
	arrayUniqFill(directionArray);
	// console.log("directionArray");
	// console.log(directionArray);
	
	for (let index = 0; index < directionArray.length; index++) {
		flag = 1;
		let freeCellSum = 0;
		let dXdY = GetDirection(directionArray[index]);
		// console.log("directionArray[index]");
		// console.log(directionArray[index]);

		for (let deckIndex = 1; deckIndex < decks; deckIndex++) {
			SetShipCoordDirection(ship, coords[COORD_X], coords[COORD_Y], directionArray[index]);
			freeCellSum = freeCellSum + simpleMap[coords[COORD_Y] + dXdY[COORD_Y] * deckIndex][coords[COORD_X] + dXdY[COORD_X] * deckIndex];
			// console.log("CELL");
			// console.log(simpleMap[coords[COORD_Y] + dXdY[COORD_Y] * deckIndex][coords[COORD_X] + dXdY[COORD_X] * deckIndex], coords[COORD_Y] + dXdY[COORD_Y] * deckIndex, coords[COORD_X] + dXdY[COORD_X] * deckIndex);
			if (freeCellSum > 0) {
				// console.log("EPIC FAIL!!! Ship not placed");
				flag = 0;
				break;
			}
		}
		if (freeCellSum == 0) {
			// console.log("Ship placed");
			// console.log(ship);
			return flag;
		}
	}
	// ------------- ВОЗМОЖНО ЭТОТ БЛОК не НУЖЕН
	if (!flag) {
		simpleMap[coords[COORD_Y]][coords[COORD_X]] = 4;
		SetShipCoordDirection(ship, 0, 0, 0);
	}
	return flag;
}

// ------------------------- Create 2d array
function Create2dArray(columns, rows) 
{
	const arr = Array(columns).fill().map(() => Array(rows).fill(EMPTY));
	return arr;
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
					localxAnDy[COORD_X] = j;
					localxAnDy[COORD_Y] = i;
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
	shuffle(arr);
}

// ------------ shuffle Arr
function shuffle(arr){
	let j, temp;
	for(let i = arr.length - 1; i > 0; i--){
		j = GetRandomFrom(0, i);
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
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

// ------ Set Ship coord and direction
function SetShipCoordDirection(ship, x, y, direct) {
	ship[COORD_X] = x;
	ship[COORD_Y] = y;
	ship[DIRECT] = direct;
}

// ----- Ship Placing
function ShipPlacing(gamemap, squadron) {
	let shipCounter = 10
	squadron.forEach(ship => {
		let emptyCells = countCellsWithNumber(gamemap, EMPTY);
		// console.log("emptyCells");
		// console.log(emptyCells);
		// console.log("ship[DECKS]");
		// console.log(ship[DECKS]);
		while (emptyCells) {
			if (emptyCells < ship[DECKS]) {
				console.log("No more space for Ship");
				return 0;
			}
			const emptyCellsCoord = GetEmptyCellCoords(gamemap);
			// console.log(emptyCellsCoord);
			const simpleMap = Map_0_1_Copy(gamemap);
			let logicalShipPlaced = TryToPlaceShip(simpleMap, emptyCellsCoord, ship);
			// console.table("logical");
			// console.table(logical);
			if (logicalShipPlaced) {
				// console.log("Ship ### placed");
				// console.log(shipCounter);
				MapFill(gamemap, ship, shipCounter);
				// console.log("GAMEMAP");
				// console.table(gamemap);
				shipCounter++;
				break;
			}
		}
	});
}

// ---------- Map Fill With new ship
function MapFill(gamemap, ship, shipCounter) {
	let localX = ship[COORD_X];
	let localY = ship[COORD_Y];
	let direction = ship[DIRECT];
	let decks = ship[DECKS];
	const dXdY = GetDirection(direction);
	let SQUARE = 3 - 1; // - SQUARE - 3 x 3
	for (let deckIndex = 0; deckIndex < decks; deckIndex++) {
		for (let j = -1; j < SQUARE; j++) {
			for (let z = -1; z < SQUARE; z++) {
				let insideX = localX + z + dXdY[COORD_X] * deckIndex;
				let insideY = localY + j + dXdY[COORD_Y] * deckIndex;
				if (gamemap[insideY][insideX] == 0) {
					gamemap[insideY][insideX] = DIRECTIONS;
				};
				gamemap[localY + dXdY[COORD_Y] * deckIndex][localX + dXdY[COORD_X] * deckIndex] = shipCounter;
			}
		}
	}
	// MapCleanUp(gamemap, DIRECTIONS, EMPTY);
}

// ---------- MapCleanUp(gamemap);
function MapCleanUp(gamemap, numberToFind, numberToChange) {
	for(let i = 0; i < gamemap.length; i++){
		for(let j = 0; j < gamemap[0].length; j++) {
			if (gamemap[j][i] == numberToFind) {
				gamemap[j][i] = numberToChange;
			};
		}
	}
}
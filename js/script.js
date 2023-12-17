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
const WORLDSIZE = 10 + 1 + 1;

const computerWorld = Create2dArray(WORLDSIZE, WORLDSIZE, EMPTY)
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

const playerWorld = Create2dArray(WORLDSIZE, WORLDSIZE, EMPTY);

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

const squadronTest = [
	[0, 0, 0, 4, 4],
	[0, 0, 0, 3, 3], [0, 0, 0, 3, 3],
	[0, 0, 0, 2, 2], [0, 0, 0, 2, 2], [0, 0, 0, 2, 2],
	[0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1]
];

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
MapCleanUp(computerWorld, DIRECTIONS, EMPTY);

console.log("playerWorld");
console.table(playerWorld);
MapCleanUp(playerWorld, DIRECTIONS, EMPTY);
console.log("playerWorld");
console.table(playerWorld);

let s = shipRemainMax(squadronTest);
console.log("shipRemainMax");
console.log(s);


// ****************************
// From C#
// карта клеток, по которым имеет смысл делать выстрел (для игрока)
const playerBitShotMap = Create2dArray(WORLDSIZE, WORLDSIZE, EMPTY);
array2dBorder(playerBitShotMap, BORDER);



// карта-решето (для игрока) - В основном цикле просто random
const playerSieve = Create2dArray(WORLDSIZE, WORLDSIZE, EMPTY);
array2dBorder(playerSieve, BORDER);


// // карта клеток, по которым имеет смысл делать выстрел (для компьютера)
// const computerBitShotMap = Create2dArray(WORLDSIZE, WORLDSIZE, EMPTY);
// array2dBorder(computerBitShotMap, BORDER);


// // карта-решето для поиска текущего корабля
// const computerSieve = Create2dArray(WORLDSIZE, WORLDSIZE, EMPTY);
// array2dBorder(computerSieve, BORDER);
// NewSieve(computerSieve, computerBitShotMap, squadronPlayer);


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
	const simpleMap = Create2dArray(WORLDSIZE, WORLDSIZE, EMPTY);
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
function Create2dArray(rows, columns, symbol) 
{
	const arr = Array(rows).fill().map(() => Array(columns).fill(symbol));
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
		let innerArrayLength = gamemap[i].length;
		for(let j = 0; j < innerArrayLength; j++) {
			if (gamemap[j][i] == numberToFind) {
				gamemap[j][i] = numberToChange;
			};
		}
	}
}

// ---------- MapOneNumber(gamemap);
function MapOneNumber(gamemap, numberToKeep, numberToChange) {
	for(let i = 0; i < gamemap.length; i++){
		let innerArrayLength = gamemap[i].length;
		for(let j = 0; j < innerArrayLength; j++) {
			if (gamemap[j][i] != numberToKeep) {
				gamemap[j][i] = numberToChange;
			};
		}
	}
}

// NEW BLOCK ----- additional gamemaps generation
const computerBitShotMap = Create2dArray(WORLDSIZE, WORLDSIZE, SIEVENUMBER);
array2dBorder(computerBitShotMap, EMPTY);
console.log("computerShotMap");
console.table(computerBitShotMap);

let shipToFind = 4;
const computerSieve = Create2dArray(WORLDSIZE, WORLDSIZE, EMPTY);
array2dBorder(computerSieve, EMPTY);
NewSieve(computerSieve, computerBitShotMap, squadronTest);
console.log("computerSieveMap");
console.table(computerSieve);


// -------------------- Функция генерации нового сита
function NewSieve(sieve, bitmap, squadron)
{
	// поиск и выбор числа палуб самого большого живого корабля в моменте
	let decksForRandomChoice = shipRemainMax(squadron);

	// случайный сдвиг для текущего сита. (Сито — это сито. Для просеивания. Никаких Dart-вёдер.)
	let shiftRandom = GetRandomFrom(0, decksForRandomChoice - 1);

	sieveGenerate(sieve, bitmap, shiftRandom, SIEVENUMBER, decksForRandomChoice);
}

// --------------- shipRemainMax
function shipRemainMax(squadron)
{
	let ship;
	for (ship of squadron) {
		if (ship[STATUS] != 0)
			{
				// console.log("ship[STATUS]");
				// console.log(ship[STATUS], ship[DECKS]);
				return ship[DECKS];
			}
		}
		return -1;
}

// -------------------- Сито для поиска текущего корабля
function sieveGenerate(sieve, shotThroughMap, shiftRandom, fillNumber, decks)
{
	shiftRandom = shiftRandom % decks;

	let localX = 1 + shiftRandom;
	let localY = 1;

	// Края карты: 1 - слева, 1 - справа. Всего: 2.
	let boardBorder = 2;

	let boardWidth = sieve.length - boardBorder;

	let boardHight = sieve[0].length - boardBorder;

	while (true)
	{
		sieve[localY][localX] = fillNumber * shotThroughMap[localY][localX];

		localX = localX + decks;

		if (localX > boardWidth)
		{
			localX = (localY + shiftRandom) % decks + 1;
			localY++;

			if (localY > boardHight)
			{
				break;
			}
		}
	}
}



// Вывод поля игрока и запрос, в бесконечном цикле, на генерацию новой 
// расстановки кораблей для игрока (человека)
while (true)
{
	PrintSymbolMap(computerWorld, playerWorld, HIDESHIP);

	let stopGame = prompt("Generate new PLAYER map? (1 - yes, 0 - no)\n-----------------------------------------------------------");

	if (stopGame == 0)
	{
		break;
	}

	// playerWorld = Create2dArray(WORLDSIZE, WORLDSIZE, EMPTY);
	// array2dFillWithNumber(playerWorld, EMPTY);
	MapOneNumber(playerWorld, BORDER, EMPTY);

	ShipPlacing(playerWorld, squadronPlayer);

	console.log("playerWorld");
	console.table(playerWorld);
	MapCleanUp(playerWorld, DIRECTIONS, EMPTY);
}
// ===============================================================================
// =================================== Конец раздела генерации игровых полей =====
// ===============================================================================


// ===============================================================================
// =================================== Подготовка и сам основной цикл  ===========
// ===============================================================================

let playerTurn = true;

let gameOver = false;

// Параметр для начальной генерации сита
let MAXDECKS = 4;

// Количество сделанных выстрелов
let playerShotsCount = 0;
let computerShotsCount = 0;
let overalTurnCount = 0;

// Бросаем монетку на очередность хода
let coinToss = GetRandomFrom(0, 1);
if (coinToss == 0)
{
	playerTurn = !playerTurn;
}

console.log((playerTurn) ? "First shot — PLAYER" : "First shot — COMPUTER");


// =====================================================================
// ====================  MAIN LOOP  ====================================
// =====================================================================
while (true)
{
	overalTurnCount++;

	console.log();
	console.log("======================================================");
	console.log();
	console.log("TURN ", overalTurnCount);

	if (playerTurn)
	{
		MainPlay(computerWorld, playerSieve, playerBitShotMap, squadronComputer, playerShotsCount);
	}

	if (!playerTurn)
	{
		MainPlay(playerWorld, computerSieve, computerBitShotMap, squadronPlayer, computerShotsCount);
	}

	if (gameOver)
	{
		break;
	}
}

// Финальные титры
console.log();
console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
console.log("&&&&&&&                                            &&&&&&&");
console.log((playerTurn) ?
						 "                        PLAYER WIN" : "                       COMPUTER WIN");
console.log();
console.log("&&&&&&&&&&&&&&           on  turn           &&&&&&&&&&&&&&");
console.log();
console.log("                            ");
console.log(overalTurnCount);
console.log("&&&&&&&                                            &&&&&&&");
console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

PrintSymbolMap(computerWorld, playerWorld, HIDESHIP);
// =====================================================================
// ====================  END of MAIN LOOP  =============================
// =====================================================================


// ----------------------- NEW UNIVERSAL MAIN PLAY FUNCTION
function MainPlay(map, sieve, bitmap, squadron, turn)
{
	while (true)
	{
		turn++;

		// Вывод игрового поля !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		console.log();
		console.log("------------------------------------------------------");

		PrintSymbolMap(computerWorld, playerWorld, HIDESHIP);

		console.log("sieve");
		console.table(sieve);

		const arrayFindAndCount = GetAndCountMaxIn2dArray(sieve);
		console.log("arrayFindAndCount");
		console.table(arrayFindAndCount);
		let numberToFind = arrayFindAndCount[COORD_X];
		let CountNumberToFind = arrayFindAndCount[COORD_Y];

		let localCoordinates = GetCellToFire(sieve, numberToFind, CountNumberToFind);

		let localY = localCoordinates / 100;
		let localX = localCoordinates % 100;

		sieve[localY][localX] = 0;
		bitmap[localY][localX] = 0;

		console.log(playerTurn ? "Player Shot " : "COMPUTER Shot ");
		console.log(turn);

		console.log("X ");
		console.log(localX);
		console.log(" Y ");
		console.log(localY);
		console.log(" ");

		let shootResult = map[localY][localX];


		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Останов между выстрелами !!!!!!!!!!!!!!!!!!!!!
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// Console.ReadLine();


		// Число для сдвига корабля. Четырехпалубник на карте имеет номер 10, последний однопалубник 19
		shipShift = 10;

		// Выстрел в молоко
		if (shootResult < shipShift)
		{
			console.log();
			console.log("MISS");
			playerTurn = !playerTurn;
			break;
		}
		// Есть ПРОБИТИЕ!!!
		console.log("    Есть ПРОБИТИЕ!!! * HIT!!!");

		// узнаем статус корабля, в который попали
		shipUnderFire = shootResult - shipShift;

		shipStatus = squadron[shipUnderFire][DIRECTIONS];


		// Если корабль потоплен
		if (shipStatus <= 1)
		{
			System.Console.WriteLine();
			System.Console.WriteLine("SHIP DESTROYED!!!");

			squadron[shipUnderFire][DIRECTIONS] = EMPTY;

			newShipToFind = shipRemainMax(squadron);

			if (newShipToFind == -1)
			{
				gameOver = true;
				break;
			}

			console.log();

			currentShip = GetCurrentShip(squadron, shipUnderFire);

			// Зачистка решета от символов добивания корабля
			ChangeNumberIn2dArray(sieve, 2, EMPTY);

			FillCellsAroundShip(bitmap, currentShip, EMPTY, SIEVENUMBER);
			FillCellsAroundShip(sieve, currentShip, EMPTY, SIEVENUMBER);


			if (!playerTurn)
			{
				if (newShipToFind < MAXDECKS)
				{
					MAXDECKS = newShipToFind;

					NewSieve(computerSieve, computerBitShotMap, squadronPlayer);
				}
			}
			continue;
		}

		// Если корабль ранен - уменьшаем счетчик действующих палуб. 
		// DIRECTION - константа = 4, и в то же время номер живых палуб в массиве корабля. 
		// Зря так сделано, но работает.
		squadron[shipUnderFire][DIRECTIONS]--;

		FillCellsAroundWoundedDeckDiagonal(localX, localY, bitmap);
		FillCellsAroundWoundedDeckDiagonal(localX, localY, sieve);

		numberToFire = 2; // Магическое число для последующего добивания корабля
		FillCellsAroundWoundedDeckCross(localX, localY, sieve, bitmap, numberToFire);

		continue;
	}
}

// --------------- GetAndCountMaxIn2dArray
// ---------- MapOneNumber(gamemap);
function MapOneNumber(gamemap, numberToKeep, numberToChange) {
	for(let i = 0; i < gamemap.length; i++){
		let innerArrayLength = gamemap[i].length;
		for(let j = 0; j < innerArrayLength; j++) {
			if (gamemap[j][i] != numberToKeep) {
				gamemap[j][i] = numberToChange;
			};
		}
	}
}


function GetAndCountMaxIn2dArray(gamemap)
{
	let maxValue = 0;
	let count = 0;
	for(let i = 0; i < gamemap.length; i++){
		let innerArrayLength = gamemap[i].length;
		for(let j = 0; j < innerArrayLength; j++) {
			if (maxValue == gamemap[j][i])
			{
				count++;
			}
			if (maxValue < gamemap[j][i])
			{
				maxValue = gamemap[j][i];
				count = 1;
			}
		}
	}

	const arr = [2];
	arr[0] = maxValue;
	arr[1] = count;

	return arr;
}

// --------------------- Вывод символьных полей игрока и компьютера
function PrintSymbolMap(computerMap, playerMap, hideShip)
{
	console.log("double map");
	console.table(computerMap);
	console.table(playerMap);

	console.log();
	console.log("         computer Map \t\t\t player Map");
	console.log();
	console.log("     1 2 3 4 5 6 7 8 9 10 \t     1 2 3 4 5 6 7 8 9 10");
	let mapString;




	for (let i = 0; i < computerMap.length; i++)
	{
		mapString = symbolY(i);

		for (let j = 0; j < computerMap[0].length; j++)
		{
			mapString = mapString + GetSymbol(computerMap[i][j], playerBitShotMap[i][j]) + " ";

		}

		mapString = mapString + "\t" + symbolY(i);

		for (let k = 0; k < playerMap[0].length; k++)
		{
			mapString = mapString + GetSymbol(playerMap[i][k], computerBitShotMap[i][k]) + " ";
		}
		console.log(mapString);
		
	}
	console.log();
}

// --------------- Вывод координаты Y в символьное поле
function symbolY(i)
{
	let symbol;
	if (i == 0 || i == 11)
	{
		symbol = "   ";
	}

	if (i > 0 && i < 11 && i != 10)
	{
		symbol = i + "  ";
	}

	if (i == 10)
	{
		symbol = i + " ";
	}
	return symbol;
}



// --------------- Получение символа карты
function GetSymbol(number, shot)

{
	// console.log("number, shot");
	// console.log(number, shot);
	
	if (shot == 1)
	{
		if (number == 0 || number == 1)
		{
			return " ";
		}

		if (number == 8)
		{
			return "M";
		}

		if (number > 8)
		{
			return "@";
		}
	}

	if (shot == 0)
	{
		if (number == 0 || number == 1)
		{
			return ".";
		}

		if (number == 8)
		{
			return "M";
		}

		if (number > 8)
		{
			return "X";
		}
	}
	// Здесь ЧТО-ТО случается!!!! Надо когда-нибудь разобраться!!! (02.02.2023)
	// console.log("Epic fail!!!");
	return "F";
}

// ------------------------- GetCellToFire
function GetCellToFire(sieve, numberToFind, count)
{
	let randomCellToFire = GetRandomFrom(1, count);

	let xAnDyToFire = randomCellXY(randomCellToFire, sieve, numberToFind);

	return xAnDyToFire;
}


// ------------ Get random cell X, Y ----
function randomCellXY(number, arr, numberToFind)
{
	let count = 0;
	let localxAnDy = 0;
	for (let i = 1; i < arr.length - 1; i++)
	{
		for (let j = 1; j < arr[0].length - 1; j++)
		{
			if (arr[j][i] == numberToFind)
			{
				count++;
				if (count == number)
				{
					localxAnDy = i * 100 + j;
					return localxAnDy;
				}
			}
		}
	}
	// Интересно, что будет делать вызывавшая функция с этим результатом?
	return localxAnDy;
}
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

// Модификатор копирования массива
const MODESIMPLE = 0;
const MODECOPY = 1;
const MODEZERO = 4;

// Размер массива игрового поля - 10х10 и ограничение края единицами. Итоговый размер 12х12.
// Не очень хороший пример для тестирования, но должен срабатывать вплоть до помещения всех однопалубных кораблей.
// В итеративном прогоне от четырехпалубника до последнего однопалубника на изначатьно пустом поле, матрица заполнения, не позволяющая встать кораблям ближе,
// чем возможно по правилам игры, равна 3 х (decks + 2). Она не даст хвосту следующего по списку корабля встать на невозможное место.
const xWORLDSIZE = 10 + 1 + 1;
const yWORLDSIZE = 10 + 1 + 1;

const computerWorld = Create2dArray(yWORLDSIZE, xWORLDSIZE, EMPTY);
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
const playerWorld = Create2dArray(yWORLDSIZE, xWORLDSIZE, EMPTY);

// Массив кораблей. [0] - x, [1] - y; [2] - direction; [3] - decks; [4] - status: n = 0 - destroyed, n = [3] — new ship, other n — wounded
const COORD_X = 0;
const COORD_Y = 1;
const DIRECT = 2;
const DECKS = 3;
const STATUS = 4;

const squadronComputer = [
  [0, 0, 0, 4, 4],
  [0, 0, 0, 3, 3],
  [0, 0, 0, 3, 3],
  [0, 0, 0, 2, 2],
  [0, 0, 0, 2, 2],
  [0, 0, 0, 2, 2],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
];

const squadronPlayer = [
  [0, 0, 0, 4, 4],
  [0, 0, 0, 3, 3],
  [0, 0, 0, 3, 3],
  [0, 0, 0, 2, 2],
  [0, 0, 0, 2, 2],
  [0, 0, 0, 2, 2],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
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
// MapPrint(testWorld);

// %%%%%%%%%%%%%  START

array2dBorder(computerWorld, BORDER);
array2dBorder(playerWorld, BORDER);

RestartShipPlacing(computerWorld, squadronComputer);
MapCleanUp(computerWorld, DIRECTIONS, EMPTY);

RestartShipPlacing(playerWorld, squadronPlayer);
MapCleanUp(playerWorld, DIRECTIONS, EMPTY);

console.log("computerWorld");
console.table(computerWorld);
MapCleanUp(computerWorld, DIRECTIONS, EMPTY);

console.log("playerWorld");
console.table(playerWorld);

console.log("FIRST PART DONE");

MapPrint(computerWorld);
MapPrint(playerWorld);

// console.log(squadronPlayer);
// console.log(squadronComputer);

let gen = 0;
while (true) {
  gen++;

  // Останов для перегенерации поля игрока
  // let regenerate = confirm("Введите число:  ");
  let regenerate = 0;

  if (!regenerate) {
    console.log("NEXT PART");
    break;
  }
  for (let index = 1; index <= 19; index++) {
    MapCleanUp(playerWorld, index, 0);
  }
  array2dBorder(playerWorld, BORDER);
  RestartShipPlacing(playerWorld, squadronPlayer);
  MapCleanUp(playerWorld, DIRECTIONS, EMPTY);
  console.log("playerWorld");
  console.log("Generation", gen);
  MapPrint(playerWorld);
}

// =======================  PART II  =========
const playerBitShotMap = Create2dArray(yWORLDSIZE, xWORLDSIZE, SIEVENUMBER);
array2dBorder(playerBitShotMap, EMPTY);

const playerSieve = Create2dArray(yWORLDSIZE, xWORLDSIZE, SIEVENUMBER);
array2dBorder(playerSieve, EMPTY);

const computerBitShotMap = Create2dArray(yWORLDSIZE, xWORLDSIZE, SIEVENUMBER);
array2dBorder(playerBitShotMap, EMPTY);

const computerSieve = Create2dArray(yWORLDSIZE, xWORLDSIZE, EMPTY);
array2dBorder(playerSieve, EMPTY);

NewSieve(computerSieve, computerBitShotMap, squadronPlayer);

console.log("playerSieve");
console.table(playerSieve);

console.log("playerBitShotMap");
console.table(playerBitShotMap);

console.log("computerSieve");
console.table(computerSieve);

console.log("computerBitShotMap");
console.table(computerBitShotMap);

// ===============================================================================
// =================================== Конец раздела генерации игровых полей =====
// ===============================================================================

// ===============================================================================
// =================================== Подготовка и сам основной цикл  ===========
// ===============================================================================
let playerTurn = true;

let gameOver = false;

// Параметр для начальной генерации сита
let maxDecks = 4;

// Количество сделанных выстрелов
let playerShotsCount = 0;
let computerShotsCount = 0;
let overalTurnCount = 0;

// Бросаем монетку на очередность хода
let coinToss = GetRandomFrom(0, 1);
if (coinToss == 0) {
  playerTurn = !playerTurn;
}

console.log(playerTurn ? "First shot — PLAYER" : "First shot — COMPUTER");

// =====================================================================
// ====================  MAIN LOOP  ====================================
// =====================================================================
while (true) {
  overalTurnCount++;

  console.log();
  console.log("======================================================");
  console.log();
  console.log("TURN " + overalTurnCount);

  if (playerTurn) {
    MainPlay(
      computerWorld,
      playerSieve,
      playerBitShotMap,
      squadronComputer,
      playerShotsCount
    );
  }

  if (!playerTurn) {
    MainPlay(
      playerWorld,
      computerSieve,
      computerBitShotMap,
      squadronPlayer,
      computerShotsCount
    );
  }

  if (gameOver) {
    break;
  }
}

// Финальные титры
console.log();
console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
console.log("&&&&&&&                                            &&&&&&&");
console.log(
  playerTurn
    ? "                        PLAYER WIN"
    : "                       COMPUTER WIN"
);
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
function MainPlay(map, sieve, bitmap, squadron, turn) {
  while (true) {
    turn++;

    // Вывод игрового поля !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    console.log();
    console.log("------------------------------------------------------");

    PrintSymbolMap(computerWorld, playerWorld, HIDESHIP);

    let arrayFindAndCount = GetAndCountMaxIn2dArray(sieve);
    let numberToFind = arrayFindAndCount[0];
    let countNumberToFind = arrayFindAndCount[1];

    // // Отладочная инфа
    // console.log("arrayFindAndCount, numberToFind, countNumberToFind");
    // console.log(arrayFindAndCount, numberToFind, countNumberToFind);
    // console.table(sieve);

    let localCoordinates = GetCellToFire(
      sieve,
      numberToFind,
      countNumberToFind
    );
    // Отладочная инфа
    console.log("localCoordinates");
    console.log(localCoordinates);

    let localY = Math.floor(localCoordinates / 100);
    let localX = localCoordinates % 100;

    sieve[localY][localX] = 0;
    bitmap[localY][localX] = 0;

    console.log(playerTurn ? "Player Shot " : "COMPUTER Shot ");
    console.log(turn);

    console.log("X= " + localX + ", Y= " + localY);

    let shootResult = map[localY][localX];

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Останов между выстрелами !!!!!!!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // alert( "Останов между выстрелами" );

    // Число для сдвига корабля. Четырехпалубник на карте имеет номер 10, последний однопалубник 19
    let shipShift = 10;

    // Выстрел в молоко
    if (shootResult < shipShift) {
      console.log();
      console.log("MISS");
      playerTurn = !playerTurn;
      break;
    }
    // Есть ПРОБИТИЕ!!!
    console.log("    Есть ПРОБИТИЕ!!! * HIT!!!");

    // узнаем статус корабля, в который попали
    let shipUnderFire = shootResult - shipShift;

    let shipStatus = squadron[shipUnderFire][DIRECTIONS];

    // Если корабль потоплен
    if (shipStatus <= 1) {
      console.log();
      console.log("SHIP DESTROYED!!!");

      squadron[shipUnderFire][DIRECTIONS] = EMPTY;

      let newShipToFind = shipRemainMax(squadron);

      if (newShipToFind == -1) {
        gameOver = true;
        break;
      }

      console.log();

      const currentShip = GetCurrentShip(squadron, shipUnderFire);

      // Зачистка решета от символов добивания корабля
      ChangeNumberIn2dArray(sieve, 2, EMPTY);

      FillCellsAroundShip(bitmap, currentShip, EMPTY, SIEVENUMBER);
      FillCellsAroundShip(sieve, currentShip, EMPTY, SIEVENUMBER);

      if (!playerTurn) {
        if (newShipToFind < maxDecks) {
          maxDecks = newShipToFind;

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

    let numberToFire = 2; // Магическое число для последующего добивания корабля
    FillCellsAroundWoundedDeckCross(
      localX,
      localY,
      sieve,
      bitmap,
      numberToFire
    );

    continue;
  }
}

// ###################################################
function MapPrint(world) {
  const localWorld = Create2dArray(yWORLDSIZE, xWORLDSIZE, EMPTY);
  NewArr2dCopy(world, localWorld, MODECOPY);
  MapCleanUp(localWorld, 0, " ");
  MapCleanUp(localWorld, 1, "*");
  MapCleanUp(localWorld, 8, "M");
  MapCleanUp(localWorld, 10, "@");
  MapCleanUp(localWorld, 11, "@");
  MapCleanUp(localWorld, 12, "@");
  MapCleanUp(localWorld, 13, "@");
  MapCleanUp(localWorld, 14, "@");
  MapCleanUp(localWorld, 15, "@");
  MapCleanUp(localWorld, 16, "@");
  MapCleanUp(localWorld, 17, "@");
  MapCleanUp(localWorld, 18, "@");
  MapCleanUp(localWorld, 19, "@");
  console.log("Symbol MAP");
  console.table(localWorld);
}

// ----- Вызов ShipPlacing, пока он не удасться
function RestartShipPlacing(gamemap, squadron) {
  let counter = 1;
  while (true) {
    let flag = ShipPlacing(gamemap, squadron);
    if (flag === 1) {
      break;
    }
    counter++;
  }
  console.log("------------------------------------ COUNTER -------------");
  console.log(counter);
}

// ----- Ship Placing
function ShipPlacing(gamemap, squadron) {
  // Create localMap and copy non-linked gamemap to localMap
  const localGamemap = Create2dArray(yWORLDSIZE, xWORLDSIZE, EMPTY);
  NewArr2dCopy(gamemap, localGamemap, MODECOPY);

  let shipCounter = 10;

  for (let index = 0; index < squadron.length; index++) {
    let ship = squadron[index];
    console.log("SHIP");
    console.log(ship);
    let emptyCells = countCellsWithNumber(localGamemap, EMPTY);
    console.log("emptyCells");
    console.log(emptyCells);
    console.log("ship[DECKS]");
    console.log(ship[DECKS]);
    if (emptyCells < ship[DECKS]) {
      console.log("No more space for Ship");
      console.table(localGamemap);
      return 0;
    }
    while (emptyCells) {
      const emptyCellsCoord = GetEmptyCellCoords(localGamemap);

      console.log("emptyCellsCoord");
      console.log(emptyCellsCoord);

      // const playerWorld = Create2dArray(yWORLDSIZE, xWORLDSIZE);
      const simpleMap = Create2dArray(yWORLDSIZE, xWORLDSIZE, EMPTY);
      NewArr2dCopy(localGamemap, simpleMap, MODESIMPLE);
      let logicalShipPlaced = TryToPlaceShip(simpleMap, emptyCellsCoord, ship);
      // console.table("logical");
      // console.table(logical);
      if (logicalShipPlaced) {
        // Отладочная инфа
        console.log("Ship ############################## placed");
        console.log(shipCounter);

        MapFill(localGamemap, ship, shipCounter);
        // console.log("GAMEMAP");
        // console.table(gamemap);
        shipCounter++;
        break;
      }
    }
  }
  console.log("All ships placed");

  NewArr2dCopy(localGamemap, gamemap, MODECOPY);

  return 1;
}

// ------------ count of cells contain NUMBER ---
function countCellsWithNumber(arr, numberToFind) {
  return [].concat(...arr).filter((x) => x === numberToFind).length;
}

// --------------------------- get coord of Empty cell
function GetEmptyCellCoords(gamemap) {
  let emptyCells = countCellsWithNumber(gamemap, EMPTY);
  let randomCell = GetRandomFrom(1, emptyCells);

  // Отладочная инфа
  console.log("randomCell number");
  console.table(randomCell);

  let xAnDy = randomCell_X_Y_Arr(randomCell, gamemap, EMPTY);
  return xAnDy;
}

// ------- RANDOM NUMBER from - to -------------------
function GetRandomFrom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ------------ Get random cell X, Y ----
function randomCell_X_Y_Arr(number, arr, numberToFind) {
  let count = 0;
  let localxAnDy = [-1, -1];
  for (let i = 1; i < arr.length - 1; i++) {
    for (let j = 1; j < arr[0].length - 1; j++) {
      if (arr[i][j] == numberToFind) {
        count++;
        if (count === number) {
          localxAnDy[COORD_X] = j;
          localxAnDy[COORD_Y] = i;
          return localxAnDy;
        }
      }
    }
  }
  return localxAnDy;
}

// ----- Try to place Ship
function TryToPlaceShip(simpleMap, coords, ship) {
  let flag = 1;
  let decks = ship[DECKS];
  if (decks === 1) {
    SetShipCoordDirection(ship, coords[COORD_X], coords[COORD_Y], STATUS);
    // console.log("ONEDECKER placed");
    // console.log(ship);
    return flag;
  }
  const directionArray = new Array(DIRECTIONS);
  ArrayUniqFill(directionArray);

  // Отладочная инфа
  // console.log("directionArray");
  // console.log(directionArray);

  for (let index = 0; index < directionArray.length; index++) {
    flag = 1;
    let freeCellSum = 0;
    let dXdY = GetDirection(directionArray[index]);
    // console.log("directionArray[index]");
    // console.log(directionArray[index]);

    for (let deckIndex = 1; deckIndex < decks; deckIndex++) {
      SetShipCoordDirection(
        ship,
        coords[COORD_X],
        coords[COORD_Y],
        directionArray[index]
      );
      freeCellSum =
        freeCellSum +
        simpleMap[coords[COORD_Y] + dXdY[COORD_Y] * deckIndex][
          coords[COORD_X] + dXdY[COORD_X] * deckIndex
        ];
      // console.log("CELL");
      // console.log(simpleMap[coords[COORD_Y] + dXdY[COORD_Y] * deckIndex][coords[COORD_X] + dXdY[COORD_X] * deckIndex], coords[COORD_Y] + dXdY[COORD_Y] * deckIndex, coords[COORD_X] + dXdY[COORD_X] * deckIndex);
      if (freeCellSum > 0) {
        // Отладочная инфа
        console.log("EPIC FAIL!!! Ship not placed");

        flag = 0;
        break;
      }
    }
    if (freeCellSum == 0) {
      // Отладочная инфа
      console.log("Ship placed");
      console.log(ship);

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

// ------------ fill Arr with unique numbers from 1 to array.length
function ArrayUniqFill(arr) {
  for (let index = 0; index < arr.length; index++) {
    arr[index] = index + 1;
  }
  Shuffle(arr);
}

// ------------ shuffle Arr
function Shuffle(arr) {
  let j, temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = GetRandomFrom(0, i);
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
}

// ------------ Get direction -----------
function GetDirection(number) {
  const dXdY = [2];
  let dX = 0;
  let dY = 0;

  if (number === 1) {
    dY = -1;
  }

  if (number === 2) {
    dX = 1;
  }

  if (number === 3) {
    dY = 1;
  }

  if (number === 4) {
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
        }
        gamemap[localY + dXdY[COORD_Y] * deckIndex][
          localX + dXdY[COORD_X] * deckIndex
        ] = shipCounter;
      }
    }
  }
}

// ===========================================================
// ------------------------- Create 2d array
function Create2dArray(columns, rows, fillNumber) {
  const arr = Array(columns)
    .fill()
    .map(() => Array(rows).fill(fillNumber));
  return arr;
}

// --------- square border in array fill with NUMBER -----
function array2dBorder(arr2d, number) {
  for (let i = 0; i < arr2d.length; i++) {
    arr2d[i][0] = number;
    arr2d[i][arr2d[0].length - 1] = number;
  }

  for (let i = 0; i < arr2d.length; i++) {
    for (let j = 1; j < arr2d[0].length - 1; j++) {
      if (i === 0 || i === arr2d.length - 1) {
        arr2d[i][j] = number;
      }
    }
  }
}

// 8888888888888888888888888888888888888888888888888888888888

// --------------------------- MapCopy - mode 0: all not 0 = 1, mode 1: non-linked copy of gamemap
function NewArr2dCopy(gamemap, simpleMap, mode) {
  // Отладочные строки
  // console.log("GAMEMAP");
  // console.table(gamemap);

  // const simpleMap = Create2dArray(yWORLDSIZE, xWORLDSIZE);
  for (let i = 0; i < simpleMap.length; i++) {
    for (let j = 0; j < simpleMap[0].length; j++) {
      if (mode === MODESIMPLE) {
        if (gamemap[i][j] != 0) {
          simpleMap[i][j] = 1;
        }
      }
      if (mode === MODECOPY) {
        simpleMap[i][j] = gamemap[i][j];
      }
    }
  }

  // Отладочные строки
  if (mode === MODESIMPLE) {
    console.log("simpleMAP");
  }
  if (mode === MODECOPY) {
    console.log("copyMAP");
  }
  // console.table(simpleMap);

  // return simpleMap;
}

// ---------- MapCleanUp(gamemap);
function MapCleanUp(gamemap, numberToFind, numberToChange) {
  for (let i = 0; i < gamemap.length; i++) {
    for (let j = 0; j < gamemap[0].length; j++) {
      if (gamemap[i][j] == numberToFind) {
        gamemap[i][j] = numberToChange;
      }
    }
  }
}

// 22222222222222222222222222222222222222222222222

// -------------------- Функция генерации нового сита
function NewSieve(sieve, bitmap, squadron) {
  // поиск и выбор числа палуб самого большого живого корабля в моменте
  let decksForRandomChoice = shipRemainMax(squadron);

  // случайный сдвиг для текущего сита. (Сито — это сито. Для просеивания. Никаких Dart-вёдер.)
  let shiftRandom = GetRandomFrom(0, decksForRandomChoice - 1);

  sieveGenerate(sieve, bitmap, shiftRandom, SIEVENUMBER, decksForRandomChoice);
}

// --------------- shipRemainMax
function shipRemainMax(squadron) {
  for (let index = 0; index < squadron.length; index++) {
    let ship = squadron[index];
    if (ship[STATUS]) {
      console.log("Fist SHIP alife");
      console.log(index, ship);
      return ship[DECKS];
    }
  }
  console.log("No more ships");
  return -1;
}

// -------------------- Сито для поиска текущего корабля
function sieveGenerate(sieve, shotThroughMap, shiftRandom, fillNumber, decks) {
  shiftRandom = shiftRandom % decks;

  let localX = 1 + shiftRandom;
  let localY = 1;

  // Края карты: 1 - слева, 1 - справа. Всего: 2.
  const BOARDBORDER = 2;

  const BOARDWIDTH = sieve[0].length - BOARDBORDER;

  const BOARDHIGHT = sieve.length - BOARDBORDER;

  while (true) {
    sieve[localY][localX] = fillNumber * shotThroughMap[localY][localX];

    localX = localX + decks;

    if (localX > BOARDWIDTH) {
      localX = ((localY + shiftRandom) % decks) + 1;
      localY++;

      if (localY > BOARDHIGHT) {
        break;
      }
    }
  }
}

// Функция для поиска максимума в двумерном массиве
function findMax(matrix) {
  let max = matrix[0][0];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] > max) {
        max = matrix[i][j];
      }
    }
  }
  return max;
}

// --------------- GetAndCountMaxIn2dArray
function GetAndCountMaxIn2dArray(map) {
  const ARRMAX = findMax(map);
  const ARRMAXCOUNT = countCellsWithNumber(map, ARRMAX);
  const arrResult = [ARRMAX, ARRMAXCOUNT];
  return arrResult;
}

// --------------------- Вывод символьных полей игрока и компьютера
function PrintSymbolMap(computerMap, playerMap, hideShip) {
  console.log();
  console.log("         computer Map \t\t\t player Map");
  console.log();
  console.log("     1 2 3 4 5 6 7 8 9 10 \t     1 2 3 4 5 6 7 8 9 10");

  for (let i = 0; i < computerMap.length; i++) {
    let symbol = "";

    symbol = symbol + symbolY(i);

    for (let j = 0; j < computerMap[0].length; j++) {
      symbol = symbol + GetSymbol(computerMap[i][j], playerBitShotMap[i][j]);
      // System.Console.Write($"{symbol} ");
    }

    symbol = symbol + "\t";

    symbol = symbol + symbolY(i);

    for (let k = 0; k < playerMap[0].length; k++) {
      symbol = symbol + GetSymbol(playerMap[i][k], computerBitShotMap[i][k]);
      // System.Console.Write($"{symbol} ");
    }

    console.log(symbol);
  }
}

// --------------- Вывод координаты Y в символьное поле
function symbolY(i) {
  let symbol = "";

  if (i == 0 || i == 11) {
    symbol = "   ";
    // System.Console.Write("   ");
  }

  if (i > 0 && i < 11 && i != 10) {
    symbol = i + "  ";
    // System.Console.Write(i);
    // System.Console.Write("  ");
  }

  if (i == 10) {
    symbol = i + " ";
    // System.Console.Write(i);
    // System.Console.Write(" ");
  }
  return symbol;
}

// --------------- Получение символа карты
function GetSymbol(number, shot) {
  if (shot == 1) {
    if (number == 0 || number == 1) {
      return "  ";
    }

    if (number == 8) {
      return "M ";
    }

    if (number > 8) {
      return "@ ";
    }
  }

  if (shot == 0) {
    if (number == 0 || number == 1) {
      return ". ";
    }

    if (number == 8) {
      return "M ";
    }

    if (number > 8) {
      return "X ";
    }
  }

  // Здесь ЧТО-ТО случается!!!! Надо когда-нибудь разобраться!!! (02.02.2023)
  console.log("Epic fail!!!");
  return "F";
}

// ------------------------- GetCellToFire
function GetCellToFire(sieve, numberToFind, count) {
  let randomCellToFire = GetRandomFrom(1, count);

  // Отладочная инфа
  if (randomCellToFire === 0) {
    console.log("000000000000000000000");
  }

  let xAnDyToFire = randomCellXY(randomCellToFire, sieve, numberToFind);

  // Отладочная инфа
  if (xAnDyToFire === 0) {
    console.log("111111111111111111");
  }

  return xAnDyToFire;
}

// ------------ Get random cell X, Y ----
function randomCellXY(number, arr, numberToFind) {
  let count = 0;
  let localxAnDy = 0;
  for (let i = 1; i < arr.length - 1; i++) {
    for (let j = 1; j < arr[0].length - 1; j++) {
      if (arr[i][j] === numberToFind) {
        count++;
        if (count === number) {
          localxAnDy = i * 100 + j;
          return localxAnDy;
        }
      }
    }
  }
  // Интересно, что будет делать вызывавшая функция с этим результатом?
  return localxAnDy;
}

// --------------- Fill Cells Around Wounded Deck
function FillCellsAroundWoundedDeckDiagonal(localX, localY, map) {
  map[localY - 1][localX - 1] = 0;
  map[localY + 1][localX - 1] = 0;
  map[localY - 1][localX + 1] = 0;
  map[localY + 1][localX + 1] = 0;
}

function FillCellsAroundWoundedDeckCross(
  localX,
  localY,
  map,
  bitMap,
  fillNumber
) {
  map[localY][localX - 1] = fillNumber * bitMap[localY][localX - 1];
  map[localY - 1][localX] = fillNumber * bitMap[localY - 1][localX];
  map[localY + 1][localX] = fillNumber * bitMap[localY + 1][localX];
  map[localY][localX + 1] = fillNumber * bitMap[localY][localX + 1];
}

// --------------- Get current ship parameter
function GetCurrentShip(squadron, ship) {
  const currentShip = [];

  for (let i = 0; i < squadron[ship].length; i++) {
    currentShip[i] = squadron[ship][i];
  }
  return currentShip;
}

// ------------------- Очистка карты от мусора
function ChangeNumberIn2dArray(map, findNumber, changeNumber) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === findNumber) {
        map[i][j] = changeNumber;
      }
    }
  }
}

// --------------------------- fill cell around ship
function FillCellsAroundShip(map, ship, fillNumber, numberToChange) {
  let headDeckX = ship[COORD_X];
  let headDeckY = ship[COORD_Y];

  const dXdY = GetDirection(ship[DIRECT]);
  let dX = dXdY[COORD_X];
  let dY = dXdY[COORD_Y];

  for (let decks = 1; decks <= ship[DECKS]; decks++) {
    for (let i = headDeckX - 1; i <= headDeckX + 1; i++) {
      for (let j = headDeckY - 1; j <= headDeckY + 1; j++) {
        // j - Y, i - X
        if (map[j][i] === numberToChange) {
          map[j][i] = fillNumber;
        }
      }
    }
    headDeckX = headDeckX + dX;
    headDeckY = headDeckY + dY;
  }
}

// const COORD_X = 0;
// const COORD_Y = 1;
// const DIRECT = 2;
// const DECKS = 3;
// const STATUS = 4;

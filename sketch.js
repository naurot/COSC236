/*
Name: Don't Matter
Date: Nov 20, 2019
Filename: PatternSearch.js
Description: creates a random character matrix and has user
              find "words" from the search list. As words are found, they are
              moved to the found list and deleted from the search list.
*/

var first = {
  X: 0,
  Y: 0
};
var last = {
  X: 0,
  Y: 0
};
var SCR_HEIGHT = 400;
var SCR_WIDTH = 390;
var mouseWasPressed = true;
var drag = false;
var matrix = [];
var sel;
var lostWordList = [{
  Name: "",
  X0: 0,
  Y0: 0,
  X1: 0,
  Y1: 0
}];
var foundWordList = [{
  Name: "",
  X0: 0,
  Y0: 0,
  X1: 0,
  Y1: 0
}];

var gameOver;
var difficulty = 1;
var button;

// function preload() {}

function setup() {
  var iLoop;

  createCanvas(700, 500);
  gameOver = false;
  button = createButton('New Game');
  button.position(540, 350);
  sel = createSelect();
  sel.position(430, 350);
  sel.option('Options');
  sel.option('Easy');
  sel.option('Moderate');
  sel.option('Difficult');
//  sel.option('Hint');
  sel.changed(mySelectEvent);
  foundWordList.splice(0, foundWordList.length);
  lostWordList.splice(0, lostWordList.length);
  fillMatrix(matrix);
  return;
}


function draw() {
  var direction = 0;
  var iLoop;
  var word = {
    Name: "",
    X0: 0,
    Y0: 0,
    X1: 0,
    Y1: 0
  };

  // reprint screen
  background('99CCFF');
  fill(0, 0, 0);
  for (var iRow = 0; iRow < 20; iRow++) {
    for (var iCol = 0; iCol < 20; iCol++) {
      letter = matrix[iRow][iCol];
      text(letter, (iRow) * 20 + 10, (iCol + 1) * 20);
    }
  }
  text("Found Words", 530, 15);
  text("Missing Words", 410, 15);

  // print lost screen words
  for (iLoop = 0; iLoop < lostWordList.length; iLoop++) {
    text(lostWordList[iLoop].Name, 420, 30 + 15 * iLoop);
  }

  // print found word list
  for (iLoop = 0; iLoop < foundWordList.length; iLoop++) {
    text(foundWordList[iLoop].Name, 520, 30 + 15 * iLoop);
    paint(foundWordList[iLoop], 0);
  }
  if (mouseIsPressed) {
    if (!drag) {
      first.X = mouseX;
      first.Y = mouseY;
      // next line determines if new game button pressed
      if (first.X > 540 && first.X < 620 && first.Y > 350 && first.Y < 370)
        setup();
      drag = true;
    }
    fill(255, 255, 0, 80)
    circle(mouseX, mouseY, 20);
  } else if (drag) {
    last.X = mouseX;
    last.Y = mouseY;
    drag = false;
    word = getWord(first, last, matrix);
    if (word.Name.length > 2 && word.Name.length < 11) {
      if (checkWord(word, lostWordList, foundWordList)) {
        if (lostWordList.length === 0) {
          gameOver = true;
          setup();
        }
      }
    }
  }
}

function mySelectEvent() {
  switch (sel.value()) {
    case 'Moderate':
      difficulty = 2;
      break;
    case 'Easy':
      difficulty = 1;
      break;
    case 'Difficult':
      difficulty = 3;
      break;
 //   case 'Hint':
 //     paint(lostWordList[lostWordList.length - 1], 1);
 //     break;
  }

  return;
}

function convertMatToScreen(number)
{
  return ((number * 380/19) +15);
}
function paint(twoMatrixCoord, purpose) {
  var direction;
  var twoC = {
    Name: "",
    X0: 0,
    Y0: 0,
    X1: 0,
    Y1: 0
  };

 
  twoC.X0 =  convertMatToScreen(twoMatrixCoord.Y0);
  twoC.Y0 =  convertMatToScreen(twoMatrixCoord.X0);
  twoC.X1 =  convertMatToScreen(twoMatrixCoord.Y1);
  twoC.Y1 =  convertMatToScreen(twoMatrixCoord.X1);

  if (purpose === 0) {
    colorHiLit1 = 255;
    colorHiLit2 = 0;
  } else if (purpose === 1) {
    colorHiLit1 = 0;
    colorHiLit2 = 255;
  }
  fill(colorHiLit1, colorHiLit1, colorHiLit2, 80);
  if (twoC.Y0 === twoC.Y1) {
    quad(twoC.X0-7, twoC.Y0 + 7, twoC.X0-7, twoC.Y0-7, twoC.X1+7, twoC.Y1-7, twoC.X1+7, twoC.Y1 + 7);
    //    direction = 0;
  } else if ((twoC.Y0 - twoC.Y1) / (twoC.X0 - twoC.X1) === -1) {
    quad(twoC.X0-6, twoC.Y0 - 8, twoC.X0-6, twoC.Y0 + 12, twoC.X1+5, twoC.Y1 + 9, twoC.X1+5, twoC.Y1 - 12);
  }
  //   direction = 1;
  else if (twoC.X0 === twoC.X1) {
    quad(twoC.X0-7, twoC.Y0 -7, twoC.X0+7, twoC.Y0 -7, twoC.X1+7, twoC.Y1 +7, twoC.X1-7, twoC.Y1 +7);
  }
  //   direction = 2;
  else if ((twoC.Y0 - twoC.Y1) / (twoC.X0 - twoC.X1) === 1) {
    quad(twoC.X0-5, twoC.Y0 - 8, twoC.X0-5, twoC.Y0 + 10, twoC.X1+4, twoC.Y1 + 10, twoC.X1+4, twoC.Y1 - 8);
  }
  //   direction = 3;
  else
    print("error in hilit direction detection");
  fill(0, 0, 0);
  return;
}

function checkWord(aWord, lostList, foundList) {
  var iLoop;
  var iNumWords;
  var iIndex;
  var bFound;
  var tmp1, tmp2, tmp0;

  bFound = false;
  iNumWords = lostList.length;

  for (iLoop = 0; iLoop < iNumWords; iLoop++) {
    tmp0 = lostList[iLoop].Name;
    tmp1 = aWord.Name;
    tmp2 = reversed(aWord.Name);
    if (((tmp1.localeCompare(tmp0)) === 0) || (tmp2.localeCompare(tmp0) === 0)) {
      iIndex = iLoop;
      if (tmp1.localeCompare(tmp0) === 0) {
        foundList.splice(foundList.length, 0, aWord);
      } else {
        foundList.splice(foundList.length, 0, tmpRevWord);
      }
      lostList.splice(iIndex, 1);
      // remove from lost list to found list
      iLoop = iNumWords; // break out of for loop
      bFound = true;
    }
  }
  return bFound;
}

// function, takes a string and returns the string reversed
function reversed(tmpWord) {
  var iLoop;
  var sResult;

  sResult = "";
  for (iLoop = 0; iLoop < tmpWord.length; iLoop++) {
    sResult = tmpWord.charAt(iLoop) + sResult;
  }
  return sResult;
}

// takes the coordinates of the mouse and returns cell location of matrix
function mouseToArray(mouse, matrix) {
  var cell = {
    X: 0,
    Y: 0
  };
  var bFlag = false;
  if (mouse.X < 10 || mouse.Y < 10)
    bFlag = true;
  if (mouse.X > 400 || mouse.Y > 400)
    bFlag = true;
  mouse.X = mouse.X - 10; // matrix offset from border by 10
  mouse.Y = mouse.Y - 10; // matrix offset from border by 10
  if (mouse.X > 393)
    mouse.X = 393;
  if (mouse.Y > 393)
    mouse.Y = 393;
  if (mouse.X < 13)
    mouse.X = 13;
  if (mouse.Y < 13)
    mouse.Y = 13;
  cell.X = int(mouse.X * 19 / 380);
  cell.Y = int(mouse.Y * 19 / 380);
  if (bFlag) // something was out of bounds - return cell
    cell = (-1, -1);
  return cell;
}

// function takes the first mouse button pressed and coordinates when mouse button released
// figures out word in matrix that the mouse was over
function getWord(first, last, matrix) {
  var cell1, cell2 = {
    X: 0,
    Y: 0
  };
  var word = {
    Name: "",
    X0: 0,
    Y0: 0,
    X1: 0,
    Y1: 0
  };
  var iLoop;
  var xPos;
  var newWord = "";
  var tmp;

  cell1 = mouseToArray(first, matrix);
  cell2 = mouseToArray(last, matrix);
  tmp = cell1.X;
  cell1.X = cell1.Y;
  cell1.Y = tmp;
  tmp = cell2.X;
  cell2.X = cell2.Y;
  cell2.Y = tmp;
  if (cell1.X === cell2.X) {
    word.X0 = cell1.X;
    word.X1 = cell2.X;
    if (cell1.Y < cell2.Y) {
      word.Y0 = cell1.Y;
      word.Y1 = cell2.Y;
    } else {
      word.Y0 = cell2.Y;
      word.Y1 = cell1.Y;
    }
  } else if (cell1.Y === cell2.Y) {
    word.Y0 = cell1.Y;
    word.Y1 = cell2.Y;
    if (cell1.X < cell2.X) {
      word.X0 = cell1.X;
      word.X1 = cell2.X
    } else {
      word.X0 = cell2.X;
      word.X1 = cell1.X;
    }
  } else if (cell1.Y < cell2.Y) {
    word.X0 = cell1.X;
    word.Y0 = cell1.Y
    word.X1 = cell2.X;
    word.Y1 = cell2.Y;
  } else if (cell2.Y > cell1.Y && cell2.X > cell1.X) {
    word.X0 = cell1.X;
    word.Y0 = cell1.Y;
    word.X1 = cell2.X;
    word.Y1 = cell2.Y;
  } else if (cell1.Y > cell2.Y && cell1.X > cell2.X) {
    word.X0 = cell2.X;
    word.Y0 = cell2.Y;
    word.X1 = cell1.X;
    word.Y1 = cell1.Y;
  } else if (cell2.Y > cell1.Y) {
    word.X0 = cell1.X;
    word.Y0 = cell1.Y;
    word.X1 = cell2.X;
    word.Y1 = cell2.Y;
  } else {
    word.X0 = cell2.X;
    word.Y0 = cell2.Y;
    word.X1 = cell1.X;
    word.Y1 = cell1.Y;
  }
  if (word.X0 === word.X1) {
    for (iLoop = word.Y0; iLoop <= word.Y1; iLoop++)
      newWord = newWord + matrix[iLoop][word.X0];
  } else if (word.Y0 === word.Y1) {
    for (iLoop = word.X0; iLoop <= word.X1; iLoop++)
      newWord = newWord + matrix[word.Y0][iLoop];
  } else if ((word.Y0 - word.Y1) / (word.X0 - word.X1) === 1) {
    xPos = word.X0;
    for (iLoop = word.Y0; iLoop <= word.Y1; iLoop++) {
      newWord = newWord + matrix[iLoop][xPos];
      xPos = xPos + 1;
    }
  } else if (((word.Y0 - word.Y1) / (word.X0 - word.X1)) === -1) {
    xPos = word.X0;
    for (iLoop = word.Y0; iLoop <= word.Y1; iLoop++) {
      newWord = newWord + matrix[iLoop][xPos];
      xPos = xPos - 1;
    }
  }
  word.Name = newWord;
  return word;
}

function myMap(iVal1, iVal2) {
  var iResult;

  iResult = int(20 * iVal1 / iVal2);
  if (iResult < 0)
    iResult = 0;
  if (iResult > 19)
    iResult = 19;

  return iResult;
}

// function produces a 20 by 20 matrix filled with random characters
function fillMatrix(matrix) {
  var iXPos;
  var iYPos;

  for (iYPos = 0; iYPos < 20; iYPos++) {
    matrix[iYPos] = [];
    for (iXPos = 0; iXPos < 20; iXPos++) {
      matrix[iYPos][iXPos] = char(int(random(26) + 65));
    }
  }
  populateLostList(matrix, difficulty); // now the matrix if filled, create patterns to find
  return;
}

// function creates patterns to find in matrix
// creates lostWordList of patterns between 3 and 10 characters
// difficulty level determines number and complexity of patterns to be found
function populateLostList(matrix, difficulty) {
  var iNumWords;
  var newWord;
  var xPos;
  var yPos;

  iNumWords = difficulty * 5; // replace with 10 * difficulty;
  iLoop = 0;
  newWord = {
    Name: "",
    X0: 0,
    Y0: 0,
    X1: 0,
    Y1: 0
  };

  do {
    xPos = int(random(20));
    yPos = int(random(20));
    switch (difficulty) {
      case 1:
        newWord = straightWord(xPos, yPos, matrix);
        break;
      case 2:
        if (coinToss()) // diff lvl2: split up diagonal and straight words
          newWord = straightWord(xPos, yPos, matrix);
        else
          newWord = diagonalWord(xPos, yPos, matrix);
        break;
      case 3:
        newWord = diagonalWord(xPos, yPos, matrix);
        break;
    }
    if ((newWord.Name).length > 2) {
      //      testWord(newWord); // just a debugging tool
      append(lostWordList, newWord); // put the newWord on lostWordList
      iLoop++;
      print(newWord.Name + " [" + newWord.Y0 + "," + newWord.X0 + "] -> [" + newWord.Y1 + "," + newWord.X1 + "]");
    }
  } while (iLoop < iNumWords);
}

function testWord(word) {
  var iLoop;
  var xPos;
  var newWord = "";
  if (word.X0 === word.X1) {
    for (iLoop = word.Y0; iLoop <= word.Y1; iLoop++)
      newWord = newWord + matrix[iLoop][word.X0];
  } else if (word.Y0 === word.Y1) {
    for (iLoop = word.X0; iLoop <= word.X1; iLoop++)
      newWord = newWord + matrix[word.Y0][iLoop];
  } else if ((word.Y0 - word.Y1) / (word.X0 - word.X1) === 1) {
    xPos = word.X0;
    for (iLoop = word.Y0; iLoop <= word.Y1; iLoop++) {
      newWord = newWord + matrix[iLoop][xPos];
      xPos = xPos + 1;
    }
  } else if (((word.Y0 - word.Y1) / (word.X0 - word.X1)) === -1) {
    xPos = word.X0;
    for (iLoop = word.Y0; iLoop <= word.Y1; iLoop++) {
      newWord = newWord + matrix[iLoop][xPos];
      xPos = xPos - 1;
    }
  }
}

// function used to make numerous decisions
function coinToss() {
  var bResult;
  bResult = false;
  if (random(1000) < 500)
    bResult = true;
  return bResult;
}

// function takes an x,y location and returns a word in 
//   a vertical or horizontal line
function straightWord(xPos, yPos, matrix) {
  var wordLength;
  var newWord = {
    Name: "",
    X0: 0,
    X1: 0,
    Y0: 0,
    Y1: 0
  };
  var iLoop;

  newWord.Name = "";
  wordLen = int(random(8) + 3);
  if (coinToss()) {
    if (xPos < 10) { // horizontal, starting at [yPos,xPos] and going fwd
      for (iLoop = 0; iLoop < wordLen; iLoop++)
        newWord.Name = newWord.Name + matrix[yPos][xPos + iLoop];
      newWord.X0 = xPos;
      newWord.X1 = xPos + (wordLen - 1);
      newWord.Y0 = yPos;
      newWord.Y1 = yPos;
    } else { // horizontal starting at [yPos, xPos -] and going to [yPos,xPos]
      newWord.X0 = xPos - (wordLen - 1);
      newWord.X1 = xPos;
      newWord.Y0 = yPos;
      newWord.Y1 = yPos;
      xPos = xPos - (wordLen - 1);
      for (iLoop = 0; iLoop < wordLen; iLoop++)
        newWord.Name = newWord.Name + matrix[yPos][xPos + iLoop];
    }
  } else { // going vertical
    if (yPos < 10) { // starting at y,x and going up
      for (iLoop = 0; iLoop < wordLen; iLoop++)
        newWord.Name = newWord.Name + matrix[yPos + iLoop][xPos];
      newWord.X0 = xPos;
      newWord.X1 = xPos;
      newWord.Y0 = yPos;
      newWord.Y1 = yPos + (wordLen - 1);

    } else { //  starting at y-,x and going up
      newWord.X0 = xPos;
      newWord.X1 = xPos;
      newWord.Y0 = yPos - (wordLen - 1);
      newWord.Y1 = yPos;
      for (iLoop = -(wordLen - 1); iLoop <= 0; iLoop++)
        newWord.Name = newWord.Name + matrix[yPos + iLoop][xPos];
    }
  }
  return newWord;
}

// function takes an x,y location and returns a word in 
//   a diagonal line
function diagonalWord(xPos, yPos, matrix) {
  var newWord = {
    Name: "",
    X0: 0,
    X1: 0,
    Y0: 0,
    Y1: 0
  };
  var wordLen;
  var iLoop;
  var direction;

  if (coinToss())
    direction = 1;
  else
    direction = 3;
  wordLen = int(random(8) + 3);
  if (direction === 1) {
    if ((xPos + wordLen <= 20) && (yPos - wordLen >= -1)) { // direction 1, from below, x decreasing, y increasing
      newWord.X0 = xPos + (wordLen - 1);
      newWord.X1 = xPos;
      newWord.Y0 = yPos - (wordLen - 1);
      newWord.Y1 = yPos;
      yPos = yPos - (wordLen - 1);
      for (iLoop = xPos + (wordLen - 1); iLoop >= xPos; iLoop--) {
        newWord.Name = newWord.Name + matrix[yPos][iLoop];
        yPos = yPos + 1;
      }
    } else if (yPos + wordLen <= 20 && xPos - wordLen >= -1) { // direction 1, going above, x decreasing, y increasing
      newWord.X0 = xPos;
      newWord.X1 = xPos - (wordLen - 1);
      newWord.Y0 = yPos;
      newWord.Y1 = yPos + (wordLen - 1);
      for (iLoop = yPos; iLoop < yPos + wordLen; iLoop++) {
        newWord.Name = newWord.Name + matrix[iLoop][xPos];
        xPos = xPos - 1;
      }
    }
  } else { // direction === 3,  x increasing, y increasing
    if ((xPos - (wordLen - 1)) >= 0 && (yPos - (wordLen - 1)) >= 0) { // starting from the bottom, going up
      newWord.X0 = xPos - (wordLen - 1);
      newWord.X1 = xPos;
      newWord.Y0 = yPos - (wordLen - 1);
      newWord.Y1 = yPos;
      yPos = yPos - (wordLen - 1);
      for (iLoop = (xPos - (wordLen - 1)); iLoop <= xPos; iLoop++) {
        newWord.Name = newWord.Name + matrix[yPos][iLoop];
        yPos = yPos + 1;
      }
    } else if ((xPos + (wordLen - 1)) < 20 && (yPos + (wordLen - 1) < 20)) { // starting at [yPos,xPos] and going up
      newWord.X0 = xPos;
      newWord.X1 = xPos + (wordLen - 1);
      newWord.Y0 = yPos;
      newWord.Y1 = yPos + (wordLen - 1);
      for (iLoop = xPos; iLoop < (xPos + wordLen); iLoop++) {
        newWord.Name = newWord.Name + matrix[yPos][iLoop];
        yPos = yPos + 1;
      }
    }
  }
  return newWord;
}
// SLOT MACHINE GAME using javascript and nodejs


const prompt = require("prompt-sync")();

const ROWS = 3;
const COL = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

const deposit_ = () => {
    const depositAmount = prompt("Enter your deposit money: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
        console.log("Please enter a valid number.");
        return deposit_();
    } else {
        return numberDepositAmount;
    }
};

const getNumberOfLines = () => {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberLines = parseInt(lines);

    if (isNaN(numberLines) || numberLines <= 0 || numberLines > 3) {
        console.log("Invalid number of lines.");
        return getNumberOfLines();
    } else {
        return numberLines;
    }
};

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter your total bet money: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Please enter a valid amount.");
        } else {
            return numberBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];

    for (let i = 0; i < COL; i++) {
        const reelSymbols = [...symbols];
        reels.push([]);
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COL; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;

            if (i !== row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const sym of symbols) {
            if (sym != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
};

const game = () => {
    let depositAmount = deposit_();

    while (true) {
        console.log("You have a balance of $ " + depositAmount);
        console.log("Your current money: " + depositAmount);

        const numberLines = getNumberOfLines();
        console.log("You have bet on " + numberLines + " lines.");

        const bet = getBet(depositAmount, numberLines);
        depositAmount -= bet * numberLines;

        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);

        const winnings = getWinnings(rows, bet, numberLines);
        depositAmount += winnings;

        console.log("You won $" + winnings.toString());

        if (depositAmount <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)? ");

        if (playAgain !== "y") {
            break;
        }
    }
};

game();

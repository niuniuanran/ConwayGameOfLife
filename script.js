function gameMain() {
    let interval;
    const nicePattern = [["7-9", "8-8", "8-10", "9-8", "9-10", "10-9", "10-10"],
        ["1-2", "2-3", "3-1", "3-2", "3-3"],
        ["7-7", "7-12", "8-5", "8-6", "8-8", "8-9", "8-10", "8-11", "8-13", "8-14", "9-7", "9-12"],
        ["7-9", "8-8", "8-9", "8-10"],
        ["3-5", "3-6", "3-7", "3-11", "3-12", "3-13", "5-3", "5-8", "5-10", "5-15", "6-3", "6-8", "6-10", "6-15", "7-3", "7-8", "7-10", "7-15", "8-5", "8-6", "8-7", "8-11", "8-12", "8-13", "10-5", "10-6", "10-7", "10-11", "10-12", "10-13", "11-3", "11-8", "11-10", "11-15", "12-3", "12-8", "12-10", "12-15", "13-3", "13-8", "13-10", "13-15", "15-5", "15-6", "15-7", "15-11", "15-12", "15-13"],
        ["9-10", "10-9", "10-11", "11-8", "11-12", "12-9", "12-10", "12-11", "14-7", "14-8", "14-12", "14-13", "15-5", "15-9", "15-11", "15-15", "16-4", "16-5", "16-9", "16-11", "16-15", "16-16", "17-3", "17-9", "17-11", "17-17", "18-4", "18-6", "18-7", "18-9", "18-11", "18-13", "18-14", "18-16"],
        ["6-7","6-8","6-9","6-10","6-11","7-7","7-11","8-7","8-9","8-10","8-11","9-7","9-9","9-11","10-7","10-8","10-9","10-10","10-11"]
    ];
    let niceIndex = function () {
        let i = -1;
        return function () {
            if (i < nicePattern.length - 1) {
                i++;
                return i;
            } else {
                i = 0;
                return i;
            }
        }
    }();

    const cellNumX = 20;
    const cellNumY = 20;
    const cells = new Array(cellNumY);
    for (let y = 0; y < cellNumY; y++) cells[y] = new Array(cellNumX);
    const newStates = new Array(cellNumY);
    for (let y = 0; y < cellNumY; y++) newStates[y] = new Array(cellNumX);
    setUpMap();
    let cellsRunning = false;

    const runButton = document.querySelector("#start-end");
    const randomButton = document.querySelector("#something-random");
    const clearButton = document.querySelector("#clear-button");
    const niceButton = document.querySelector("#something-nice");

    runButton.addEventListener("click", hitRunButton);
    clearButton.addEventListener("click", doClear);
    niceButton.addEventListener("click", doNice);
    randomButton.addEventListener("click", doRandom);

    function hitRunButton() {
        if (!cellsRunning) {
            setGo();
        } else {
            setStop();
        }
    }

    function setStop() {
        runButton.innerText = "Start";
        cellsRunning = false;
        cellRunStop();
    }

    function setGo() {
        runButton.innerText = "Stop";
        cellsRunning = true;
        cellRun();
    }

    function cellRun() {
        interval = setInterval(mapUpdate, 400);
    }

    function cellRunStop() {
        clearInterval(interval);
    }

    function doClear() {
        setStop();
        for (let y = 0; y < cellNumY; y++) {
            for (let x = 0; x < cellNumX; x++) {
                cells[y][x].classList.remove("alive");
            }
        }
    }

    function doRandom() {
        setStop();
        doClear();
        for (let y = 0; y < cellNumY; y++) {
            for (let x = 0; x < cellNumX; x++) {
                if (Math.random() > 0.8) cells[y][x].classList.add("alive");
            }
        }
        setGo();
    }

    function doNice() {
        doClear();
        setStop();
        nicePattern[niceIndex()].forEach(id => {
            document.getElementById(id).classList.add("alive");
        });
        setGo();
    }

    function mapUpdate() {
        let someThingAlive = false;
        for (let y = 0; y < cellNumY; y++) {
            for (let x = 0; x < cellNumX; x++) {
                newStates[y][x] = willBeAlive(y, x);
            }
        }
        for (let y = 0; y < cellNumY; y++) {
            for (let x = 0; x < cellNumX; x++) {
                if (newStates[y][x]) {
                    cells[y][x].classList.add("alive");
                    someThingAlive = true
                } else cells[y][x].classList.remove("alive");
            }
        }
        if (!someThingAlive) {
            setTimeout(setStop, 300);
        }
    }

    function willBeAlive(y, x) {
        let countSurround = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                countSurround += addAliveCount(y + i, x + j);
            }
        }
        if (cells[y][x].classList.contains("alive")) return (countSurround === 3 || countSurround === 4);
        else return countSurround === 3;

        function addAliveCount(y, x) {
            if (x < 0) return 0;
            if (y < 0) return 0;
            if (x >= cellNumX) return 0;
            if (y >= cellNumY) return 0;
            return cells[y][x].classList.contains("alive");
        }
    }

    function setUpMap() {
        const container = document.querySelector("#cell-container");
        container.style.gridTemplateColumns = `repeat(${cellNumX}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${cellNumY}, 1fr)`;

        for (let y = 0; y < cellNumY; y++) {
            for (let x = 0; x < cellNumX; x++) {
                cells[y][x] = document.createElement("div");
                cells[y][x].className = "cell";
                cells[y][x].id = y + "-" + x;
                cells[y][x].width = container.width / cellNumX;
                cells[y][x].height = container.height / cellNumY;
                cells[y][x].addEventListener("click", function () {
                    toggleCell(this)
                });
                container.appendChild(cells[y][x]);
            }
        }
    }

    function toggleCell(cell) {
        cell.classList.toggle("alive");
    }


}

window.onload = gameMain;
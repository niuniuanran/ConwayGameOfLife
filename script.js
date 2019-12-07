function gameMain() {
    let interval;
    const nicePattern = [["7-9", "8-8", "8-10", "9-8", "9-10", "10-9", "10-10"],
        ["1-2", "2-3", "3-1", "3-2", "3-3"],
        ["7-7", "7-12", "8-5", "8-6", "8-8", "8-9", "8-10", "8-11", "8-13", "8-14", "9-7", "9-12"],
        ["7-9","8-8","8-9","8-10"]];
    let niceIndex = function () {
        let i = -1;
        return function () {
            if (i < nicePattern.length-1) {
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
                if (newStates[y][x]) {cells[y][x].classList.add("alive"); someThingAlive=true}
                else cells[y][x].classList.remove("alive");
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
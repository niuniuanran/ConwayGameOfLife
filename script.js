let interval;
const cellNumX = 20;
const cellNumY = 20;
const cells = new Array(cellNumY * cellNumX);

function gameEngine() {
    setUpMap();
}

function setUpMap() {
    const container = document.getElementById("cell-container");
    container.style.gridTemplateColumns=`repeat(${cellNumX}, 1fr)`;
    container.style.gridTemplateRows=`repeat(${cellNumY}, 1fr)`;


    for (let i = 0; i < cells.length; i++) {
        cells[i] = document.createElement("div");
        cells[i].className = "cell dead";
        cells[i].id=i;
        cells[i].width = container.width/cellNumX;
        cells[i].height = container.height/cellNumY;
        cells[i].addEventListener("click", function(){toggleCell(this)});
        container.appendChild(cells[i]);
    }

}

function toggleCell (cell) {
    cell.classList.toggle("alive");
    cell.classList.toggle("dead");
}

window.onload = setUpMap;
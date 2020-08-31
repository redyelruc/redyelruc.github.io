let paintable = false; //mousedown=true mouseup=false: when paintable, cells change color on mouseover.
let eraseMode = false; // controls whether color is white or fillColor
let defaultColor = "#009900";
let gridSize = 40;  //number of cells in a row/column
let fillColor; // color that cells will be painted
let cellBorderStyle = "1px solid rgb(230,230,230)";

window.addEventListener("load", startup());

// set the color, delete the grid, add new grid
function startup() {
    let colorWell = document.querySelector("#color");
    colorWell.value = defaultColor;
    fillColor = defaultColor;
    colorWell.addEventListener("change", () => {
        fillColor = event.target.value
    }, false);
    colorWell.select();

    let gridSizeControl = document.querySelector("#gridsize");
    gridSizeControl.value = gridSize;
    gridSizeControl.addEventListener("change", () => {
        gridSize = event.target.value;
        deleteGrid();
        makeGrid(gridSize);
        toggleGridlines(document.querySelector("#gridline-visibility"));
    }, false);

    deleteGrid();
    makeGrid(gridSize);
}

// make a new grid
function makeGrid(size) {
    let sketchpad = document.getElementById("sketchpad");
    sketchpad.style.setProperty('--grid-rows', size);
    sketchpad.style.setProperty('--grid-cols', size);
    for (c = 0; c < (size * size); c++) {
        let cell = document.createElement("div");
        cell.style.border = cellBorderStyle;
        cell.style["background-color"] = "white";
        cell.addEventListener("click", () => { paintCell(cell) });
        cell.addEventListener("mousedown", () => { paintable = true });
        cell.addEventListener("mouseup", () => { paintable = false });
        cell.addEventListener("mouseover", () => { if (paintable) { paintCell(cell) } });
        cell.addEventListener("mousedown", function(event){
            event.preventDefault()
          });
        sketchpad.appendChild(cell).className = "grid-item";
    };
}

// delete existing grid
function deleteGrid() {
    let sketchpad = document.getElementById("sketchpad");
    while (sketchpad.firstChild) {
        sketchpad.removeChild(sketchpad.lastChild);
    }
}


// make gridlines visible/invisible
function toggleGridlines(element) {
    let cells = document.getElementsByClassName("grid-item");
    for (let i = 0; i < cells.length; i++) {
        if (element.checked) {
            cells[i].style.border = cellBorderStyle;
        } else {
            cells[i].style.border = "none";
        }
    }
}

// color a cell
function paintCell(cell) {
    if (eraseMode) {
        cell.style['background-color'] = "white";
    } else {
        cell.style['background-color'] = fillColor;
    }
}

// ensure number entered does not exceed min and max allowed
// if it does, change to either min or max
function enforceMinMax(element) {
    if (element.value != "") {
        if (parseInt(element.value) < parseInt(element.min)) {
            element.value = element.min;
        }
        if (parseInt(element.value) > parseInt(element.max)) {
            element.value = element.max;
            element.click();
        }
    }
}


// turn erase mode on or off
function toggleEraseMode() {
    let button = document.getElementById("erase-toggle");
    if (!eraseMode) {     // if not currently in erase mode, switch on
        eraseMode = true;
        button.style["font-weight"] = "bold";
        button.style["background-color"] = "#ffcccc";
        button.style.border = "1px solid red";
    } else {     // if currently in erase mode, switch to normal
        eraseMode = false;
        button.style["font-weight"] = "normal";
        button.style["background-color"] = "white";
        button.style.border = "1px solid black";
    }
}

function captureSketchpad() {
    sketchpad = document.getElementById("sketchpad");
    html2canvas(sketchpad, { onrendered:function(canvas) 
        {
        let imageURL = canvas.toDataURL('sketch/png');
        window.open(imageURL);
        }
    });
}

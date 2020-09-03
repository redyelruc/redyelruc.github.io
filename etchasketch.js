// set global variables 
let paintable = false; //mousedown=true mouseup=false: when paintable, cells change color on mouseover.
let eraseMode = false; // controls whether color of paint is white or fillColor
let defaultColor = "#8e00ff"; //purple
let gridSize = 40;  //number of cells in a row/column
let fillColor; // color that cells will be painted
let cellBorderStyle = "1px solid rgb(230,230,230)";
let fillStyle = 'color'; // switches between monochrome/color
// shades from white to black
let monochromePalette = ["rgb(255, 255, 255)", "rgb(220, 220, 220)", "rgb(190, 190, 190)", "rgb(153, 153, 153)", "rgb(119, 119, 119)", 
                    "rgb(85, 85, 85)", "rgb(51, 51, 51)", "rgb(17, 17, 17)", "rgb(0, 0, 0)"];


// start the program
window.addEventListener("load", startup());

// set the color, delete the grid, add new grid
function startup() {
    initialiseColorWell();
    initialiseGridSizeControl();
    initialiseColorToggle();
    deleteGrid();
    makeGrid(gridSize);
}

// set up the grid size controller
function initialiseGridSizeControl(){
    let gridSizeControl = document.querySelector("#gridsize");
    gridSizeControl.value = gridSize;
    gridSizeControl.addEventListener("change", () => {
        gridSize = event.target.value;
        deleteGrid();
        makeGrid(gridSize);
        toggleGridlines(document.querySelector("#gridline-visibility"));
    }, false);
}

// set up the toggle between color and monochrome
function initialiseColorToggle(){
    let colorToggle = document.querySelector("#color-tog");
    colorToggle.checked = "checked";
    fillStyle = "color";
}

// set up the colorWell and set to default color
function initialiseColorWell(){
    let colorWell = document.querySelector("#color");
    colorWell.value = defaultColor;
    fillColor = defaultColor;
    colorWell.addEventListener("change", () => {
        fillColor = event.target.value
    }, false);
    colorWell.select();
}

// make a new grid
function makeGrid(size) {
    let sketchpad = document.getElementById("sketchpad");
    sketchpad.style.setProperty('--grid-rows', size);
    sketchpad.style.setProperty('--grid-cols', size);
    for (c = 0; c < (size * size); c++) {
        let cell = document.createElement("div");
        cell.style.border = cellBorderStyle;
        cell.style["background-color"] = "rgb(255, 255, 255)";
        //add events for mouse movements
        cell.addEventListener("mousedown", () => { paintable = true });
        cell.addEventListener("mouseup", () => { paintable = false });
        cell.addEventListener("mouseover", () => { 
            if (paintable) { 
                if (fillStyle === "color"){paintCell(cell);}
                else{paintCellMonochrome(cell);} 
            } });
        cell.addEventListener("click", () => { 
            if (fillStyle === "color"){paintCell(cell);}
            else{paintCellMonochrome(cell);}
        });
        // prevent cell from being dragged like on normal mousedown
        cell.addEventListener("mousedown", function(event){event.preventDefault()});
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

// color a cell
function paintCell(cell) {
    if (eraseMode) {
        cell.style['background-color'] = "rgb(255, 255, 255)";
    } else {
        cell.style['background-color'] = fillColor;
    }
}

// color a cell a darker shade of grey
function paintCellMonochrome(cell) {
    if (eraseMode) {
        cell.style['background-color'] = "rgb(255, 255, 255)";
    } else {
        let currentShade = cell.style['background-color'];
        let newShade = currentShade;
        if (monochromePalette.indexOf(currentShade) < monochromePalette.length){
            newShade = monochromePalette[monochromePalette.indexOf(currentShade) + 1];
        }
        cell.style['background-color'] = newShade;
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
        button.addEventListener("mouseover", () => {button.style['font-weight'] = "bold";});
        button.addEventListener("mouseout", () => {button.style['font-weight'] = "normal";});
    }
}

// toggle monochrome/color
function toggleMonochrome(){
    if (fillStyle === "color"){
        fillStyle = "mono";
    } else if (fillStyle === "mono"){
        fillStyle = "color";
    }
}

// take a screenshot of the sketchpad and open in new window
function captureSketchpad() {
    sketchpad = document.getElementById("sketchpad");
    html2canvas(sketchpad, { onrendered:function(canvas){
        let imageURL = canvas.toDataURL('sketch/png');
        let win = window.open(imageURL,"_new");
        win.document.write("<head><title>Sketch.png</title></head>");
        win.document.write(`<a download="sketch.png" href='${canvas.toDataURL("sketch/png")}'>`);
        win.document.write("<img src= '"+ canvas.toDataURL("sketch/png") + "'/></a>");
        }
    });
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

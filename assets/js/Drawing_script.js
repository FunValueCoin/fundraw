document.addEventListener('DOMContentLoaded', (event) => {
    // Get the drawing and grid canvas elements
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasSize = 480;
    var gridSize = 24;
    var cellSize = canvasSize / gridSize;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);



    // grid canvas
    var isGridVisible = false;
    var gridCanvas = document.getElementById('gridCanvas');
    var gridCtx = gridCanvas.getContext('2d');
    var toggleGrid = document.getElementById('toggle-grid');
    gridCanvas.style.pointerEvents = 'none';
    gridCanvas.width = canvasSize;
    gridCanvas.height = canvasSize;
    gridCtx.fillStyle = "rgba(0, 0, 0, 0)";  // This is transparent
    gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);



    // Add event listenerfor  the grid toggle button
    toggleGrid.addEventListener('click', function () {
        isGridVisible = !isGridVisible;
        if (isGridVisible) {
            drawGrid();
        } else {
            clearGrid();
        }
    });

    // Function to draw the grid
    function drawGrid() {
        gridCtx.beginPath();
        for (var x = 0; x <= gridCanvas.width; x += cellSize) {
            gridCtx.moveTo(x, 0);
            gridCtx.lineTo(x, gridCanvas.height);
        }
        for (var y = 0; y <= gridCanvas.height; y += cellSize) {
            gridCtx.moveTo(0, y);
            gridCtx.lineTo(gridCanvas.width, y);
        }
        gridCtx.strokeStyle = "black";
        gridCtx.stroke();
    }

    // Function to clear the grid
    function clearGrid() {
        gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    }


    var isDrawing = false;
    var selectedColor = '#000000';
    var currentTool = 'pencil';
    var currentColor = '#000000';
    var pencil = document.getElementById('pencil');
    // Add event listeners for the tools
    pencil.addEventListener('click', function () {
        currentTool = 'pencil';
        ctx.strokeStyle = currentColor;
    });


    var eraser = document.getElementById('eraser');
    eraser.addEventListener('click', function () {
        currentTool = 'eraser';
        ctx.strokeStyle = '#FFFFFF';  // Assuming the eraser is always white
    });


    var undoButton = document.getElementById('undoButton');
    // Add event listener for the undo button
    undoButton.addEventListener('click', function () {

        // Code to undo the last drawing action
    });



    // Add event listeners for the color palette
    var colors = document.querySelectorAll('.color');
    colors.forEach(function (colorDiv) {
        colorDiv.addEventListener('click', function () {
            // Usuń klasę 'selected' z obecnie wybranego koloru
            document.querySelector('.color.selected').classList.remove('selected');
            // Dodaj klasę 'selected' do klikniętego diva
            colorDiv.classList.add('selected');
            // Zaktualizuj wybrany kolor
            selectedColor = getComputedStyle(colorDiv).backgroundColor;
        });
    });


    canvas.addEventListener('mousedown', function (evt) {
        isDrawing = true;
        var pos = getPos(canvas, evt);
        drawSquare(pos.x, pos.y, currentTool === 'eraser' ? 'white' : selectedColor);
    });

    canvas.addEventListener('mousemove', function (evt) {
        if (isDrawing) {
            var pos = getPos(canvas, evt);
            drawSquare(pos.x, pos.y, currentTool === 'eraser' ? 'white' : selectedColor);
        }
    });

    canvas.addEventListener('mouseup', function (evt) {
        isDrawing = false;
    });

    canvas.addEventListener('touchstart', function (evt) {
        isDrawing = true;
        var pos = getPos(canvas, evt.touches[0]);
        drawSquare(pos.x, pos.y, currentTool === 'eraser' ? 'white' : selectedColor);
        evt.preventDefault();
    }, false);

    canvas.addEventListener('touchmove', function (evt) {
        if (isDrawing) {
            var pos = getPos(canvas, evt.touches[0]);
            drawSquare(pos.x, pos.y, currentTool === 'eraser' ? 'white' : selectedColor);
        }
        evt.preventDefault();
    }, false);

    canvas.addEventListener('touchend', function (evt) {
        isDrawing = false;
    }, false);

    function getPos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
            y: Math.floor((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
        };
    }

    function drawSquare(x, y, color) {
        var cellX = Math.floor(x / cellSize);
        var cellY = Math.floor(y / cellSize);

        ctx.fillStyle = color;
        ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
    }





    var undoStack = [];  // Stack to hold the canvas states

    // Save the initial state of the canvas
    undoStack.push(canvas.toDataURL());  // This creates a snapshot of the canvas

    // Whenever you finish drawing something on the canvas
    canvas.addEventListener('mouseup', function () {
        // Save the current state of the canvas
        undoStack.push(canvas.toDataURL());  // This creates a snapshot of the canvas
    });

    canvas.addEventListener('touchend', function () {
        // Save the current state of the canvas
        undoStack.push(canvas.toDataURL());  // This creates a snapshot of the canvas
    });

    // When the user clicks the undo button
    undoButton.addEventListener('click', function () {
        if (undoStack.length > 1) {  // Leave the initial state on the stack
            // Remove the last snapshot from the stack
            undoStack.pop();
            // Get the new last snapshot from the stack
            var lastSnapshot = undoStack[undoStack.length - 1];

            // Create a new image element
            var img = new Image();

            // When the image has loaded, draw it on the canvas
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            // Start loading the image
            img.src = lastSnapshot;
        }
    });
});



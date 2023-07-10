document.addEventListener("DOMContentLoaded", function(event) {
    const genMazeButton = document.querySelector("#gen-maze-bttn");
    const solveMazeButton = document.querySelector("#solve-maze-bttn");
    const mazeContainer = document.getElementById("maze-container");
  
    const mazeGenerator = new MazeGenerator();
    const mazeSolver = new MazeSolver();
  
    let maze = [];
  
    genMazeButton.addEventListener("click", (event) => {
        mazeGenerator.generateMaze(0, 0, 24, 39);
        maze = mazeGenerator.getMaze();

        while (mazeContainer.firstChild) {
            mazeContainer.removeChild(mazeContainer.firstChild);
        }
  
        for (let i = 0; i < maze.length; i++) {
            const row = document.createElement("div");
            row.classList.add("maze-row");
  
            for (let j = 0; j < maze[i].length; j++) {
                const cell = document.createElement("div");
    
                if (maze[i][j] === "#") {
                    cell.classList.add("maze-wall");
                } else if (maze[i][j] === "s") {
                    cell.classList.add("maze-start");
                    cell.innerHTML = "S";
                } else if (maze[i][j] === "f") {
                    cell.classList.add("maze-finish");
                    cell.innerHTML = "F";
                } else {
                    cell.classList.add("maze-empty");
                }
                row.appendChild(cell);
            }
        mazeContainer.appendChild(row);
        }

    solveMazeButton.removeAttribute("disabled");
    });
  
    solveMazeButton.addEventListener("click", (event) => {
        const source = [0, 0];
        const destination = [24, 39];
        const solution = mazeSolver.findPath(maze, source, destination);

        animateSolution(solution, 0);
    });
  
    function animateSolution(solution, index) {
        if (index >= solution.length) {
            return;
        }
  
        const [row, col] = solution[index];
        const cell = mazeContainer.children[row].children[col];
        cell.classList.add("path");

        requestAnimationFrame(() => {
            animateSolution(solution, index + 1);
        });
    }
});
  

class MazeGenerator {
    constructor() {
        this.ROWS = 25;
        this.COLS = 40;
        this.maze = [];
        this.visited = [];
        this.random = new Random();
    }
  
    getMaze() {
        return this.maze;
    }
  
    getRows() {
        return this.ROWS;
    }
  
    getCols() {
        return this.COLS;
    }
  
    generateMaze(startRow, startCol, endRow, endCol) {
        for (let row = 0; row < this.ROWS; row++) {
            this.maze[row] = [];
            this.visited[row] = [];
            for (let col = 0; col < this.COLS; col++) {
                let randomNumber = this.random.nextInt(5);
                this.maze[row][col] = randomNumber === 0 ? " " : "#";
                this.visited[row][col] = false;
            }
        }

        let start = [startRow, startCol];
        let dest = [endRow, endCol];

        // Generate path using DFS
        this.generatePath(start, dest);

        // Set the start and end positions
        this.maze[startRow][startCol] = "s";
        this.maze[endRow][endCol] = "f";
    }
  
    generatePath(start, destination) {
        let visited = [];
        let stack = [];

        for (let row = 0; row < this.ROWS; row++) {
            visited[row] = [];
        for (let col = 0; col < this.COLS; col++) {
            visited[row][col] = false;
        }
    }
  
        visited[start[0]][start[1]] = true;
        stack.push([start]);

        // UP DOWN LEFT RIGHT
        let directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
        ];
  
        while (stack.length > 0) {
            let path = stack.pop();
            let cur = path[path.length - 1];
            this.maze[cur[0]][cur[1]] = " ";

            if (cur[0] === destination[0] && cur[1] === destination[1]) {
                return true;
            }
    
            // Shuffle the directions using Fisher-Yates algorithm
            for (let i = directions.length - 1; i > 0; i--) {
                let j = this.random.nextInt(i + 1);
                let temp = directions[i];
                directions[i] = directions[j];
                directions[j] = temp;
            }
  
            // Explore each direction
            for (let dir of directions) {
                let neighbor = [cur[0] + dir[0], cur[1] + dir[1]];
                if (this.isValidMove(neighbor[0], neighbor[1], visited)) {
                    visited[neighbor[0]][neighbor[1]] = true;
                    path = [...path, neighbor];
                    stack.push(path);
                }
            }
        }
    return false;
    }
  
    isValidMove(row, col, visited) {
        return (
            row >= 0 && row < this.ROWS && col >= 0 && col < this.COLS && !visited[row][col]
        );
    }
}

class Random {
    nextInt(max) {
        return Math.floor(Math.random() * max);
    }
}

class MazeSolver {
    findPath(maze, source, destination) {
        const rows = maze.length;
        const cols = maze[0].length;

        const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
        const queue = [];

        visited[source[0]][source[1]] = true;
        queue.push([source]);

        const directions = [
            [-1, 0], // UP
            [1, 0], // DOWN
            [0, -1], // LEFT
            [0, 1] // RIGHT
        ];

        while (queue.length > 0) {
            const path = queue.shift();
            const cur = path[path.length - 1];

            if (cur[0] === destination[0] && cur[1] === destination[1]) {
                console.log("Destination reached!");
                return path;
            }

            for (const dir of directions) {
                const neighbor = [cur[0] + dir[0], cur[1] + dir[1]];

                if (this.isValid(neighbor, maze, visited)) {
                    visited[neighbor[0]][neighbor[1]] = true;
                    const newPath = [...path, neighbor];
                    queue.push(newPath);
                }
            }
        }

        return null;
    }

    isValid(neighbor, maze, visited) {
        const curRow = neighbor[0];
        const curCol = neighbor[1];

        const rowLength = maze.length;
        const colLength = maze[0].length;

        if (
            curRow >= 0 &&
            curRow < rowLength &&
            curCol >= 0 &&
            curCol < colLength &&
            maze[curRow][curCol] !== "#" &&
            !visited[curRow][curCol]
        ) {
            return true;
        }

    return false;
    }
}

  
  
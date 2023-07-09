document.addEventListener('DOMContentLoaded', function(event) {
    gen_maze_bttn = document.querySelector('#gen-maze-bttn');
    gen_maze_bttn.addEventListener('click', (event) => {
        fetch("/getMaze")
        .then(response => response.json())
        .then(maze => {
            const mazeContainer = document.getElementById("maze-container");

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

            solve_maze_bttn = document.querySelector('#solve-maze-bttn');
            solve_maze_bttn.removeAttribute('disabled');
            solve_maze_bttn.addEventListener('click', (event) => {
                fetch("/solveMaze")
                .then(response => response.json())
                .then(solution => {
                    animateSolution(solution, 0); 
                })
                .catch(error => {
                    console.log(error);
                });               

                function animateSolution(solution, index) {
                    if (index >= solution.length) {
                      return;
                    }
                  
                    const [row, col] = solution[index];
                    const cell = mazeContainer.children[row].children[col];
                    cell.classList.add("path");
                  
                    setTimeout(() => {
                      animateSolution(solution, index + 1);
                    }, 100);
                  }

            })
        })
        .catch(error => {
            console.error(error);
        });        
    })   
});


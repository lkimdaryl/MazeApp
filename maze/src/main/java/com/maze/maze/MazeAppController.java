package com.maze.maze;

import java.util.List;
import java.util.Random;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MazeAppController {

    private Maze_Generator mazeGenerator = new Maze_Generator();
    private final int ROWS = mazeGenerator.getRows();
    private final int COLS = mazeGenerator.getCols();

    private Maze_Solver mazeSolver = new Maze_Solver();
    private List<int[]> path;

    Random random = new Random();

    int startRow = 0;
    int startCol = random.nextInt(COLS - 1);
    int endRow = ROWS - 1;
    int endCol = random.nextInt(COLS - 1);

    int[] source = {startRow, startCol};
    int[] dest = {endRow, endCol};

    @GetMapping("/getMaze")
    public char[][] getMaze(){              
        mazeGenerator.generateMaze(startRow, startCol, endRow, endCol);
        char[][] maze = mazeGenerator.getMaze();
        this.path = mazeSolver.findPath(maze, source, dest);

        return maze;
    }

    @GetMapping("/solveMaze")
    public List<int[]> solveMaze(){
        return this.path;
    }
}

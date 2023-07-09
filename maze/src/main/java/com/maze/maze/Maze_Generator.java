package com.maze.maze;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.Stack;

public class Maze_Generator {
    private static final int ROWS = 25;
    private static final int COLS = 40;
    private char[][] maze;
    private boolean[][] visited;

    Random random = new Random();

    public Maze_Generator() {
        maze = new char[ROWS][COLS];
        visited = new boolean[ROWS][COLS];
    }

    public char[][] getMaze(){
        return maze;
    }

    public int getRows(){
        return ROWS;
    }

    public int getCols(){
        return COLS;
    }
    public void generateMaze(int startRow, int startCol, int endRow, int endCol) {
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int randomNumber = random.nextInt(5);
                maze[row][col] = (randomNumber == 0) ? ' ' : '#';
                visited[row][col] = false;
            }
        }

        int[] start = {startRow, startCol};
        int[] dest = {endRow, endCol}; 

        // Generate path using DFS
        generatePath(start, dest);

        // Set the start and end positions
        maze[startRow][startCol] = 's';
        maze[endRow][endCol] = 'f';


    }

    private boolean generatePath(int[] start, int[] destination) {
        boolean[][] visited = new boolean[ROWS][COLS];
        Stack<List<int[]>> stack = new Stack<>();

        visited[start[0]][start[1]] = true;
        stack.push(Arrays.asList(start));

                            //   UP    DOWN   LEFT   RIGHT
        int[][] directions = {{-1,0}, {1,0}, {0,-1}, {0,1}};

        while (!stack.isEmpty()) {
            List<int[]> path = stack.pop();
            int[] cur = path.get(path.size()-1);
            maze[cur[0]][cur[1]] = ' ';

            if (Arrays.equals(cur, destination)){
                return true;
            }

            //Shuffle the directions using Fisher-Yates algorithm
            for (int i = directions.length - 1; i > 0; i--){
                int j = random.nextInt(i + 1);
                int[] temp = directions[i];
                directions[i] = directions[j];
                directions[j] = temp;
            }

            // Explore each direction
            for(int[] dir: directions){                                
                int[] neighbor = {cur[0] + dir[0], cur[1] + dir[1]};
                if (isValidMove(neighbor[0], neighbor[1], visited)){
                    visited[neighbor[0]][neighbor[1]] = true;
                    path = new ArrayList<>(path);
                    path.add(neighbor);
                    stack.push(path);
                }
            }
        }
        return false;
    }

    private boolean isValidMove(int row, int col, boolean[][] visited2) {
        return row >= 0 && row < ROWS && col >= 0 && col < COLS && !visited2[row][col];
    }

    public void printMaze() {
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                System.out.print(maze[row][col] + " ");
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        Random random = new Random();
        long startTime = System.currentTimeMillis();
        for (int i=0; i<100; i++){
            int startRow = 0;
            int startCol = random.nextInt(COLS - 1);
            int endRow = ROWS - 1;
            int endCol = random.nextInt(COLS - 1);

            Maze_Generator mazeGenerator = new Maze_Generator();
            mazeGenerator.generateMaze(startRow, startCol, endRow, endCol);
            mazeGenerator.printMaze();
            System.out.println();
        }
        long endTime = System.currentTimeMillis();
        long elapsedTime = endTime - startTime;
        System.out.println("Runtime: " + elapsedTime + " milliseconds");
    }
}
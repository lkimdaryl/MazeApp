package com.maze.maze;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Random;

public class Maze_Solver {

    public List<int[]> findPath(char [][] maze, int[] source, int[] destination){
        
        int rows = maze.length;
        int cols = maze[0].length;

        boolean[][] visited = new boolean[rows][cols];
        Queue<List<int[]>> queue = new LinkedList<>();

        visited[source[0]][source[1]] = true;
        queue.add(new ArrayList<>(Arrays.asList(source)));

        int[][] directions = {{-1,0},   // UP
                            {1,0},      // DOWN
                            {0,-1},     // LEFT
                            {0,1}};     //RIGHT
        
        while (!queue.isEmpty()){
            List<int[]> path = queue.poll();
            int[] cur = path.get(path.size() - 1);
            if (Arrays.equals(cur, destination)) {
                System.out.println("Destination reached!");
                return path;
            }

            for (int[] dir: directions){
                int[] neighbor = {cur[0]+dir[0], cur[1]+dir[1]};
                if (isValid(neighbor, maze, visited)){
                    visited[neighbor[0]][neighbor[1]] = true;
                    List<int[]> newPath = new ArrayList<>(path);
                    newPath.add(neighbor);
                    queue.add(newPath);                
                }
            }
        }

        return null;
    }

    private boolean isValid(int[] neighbor, char[][] maze, boolean[][] visited) {
        int cur_row = neighbor[0];
        int cur_col = neighbor[1];

        int row_length = maze.length;
        int col_length = maze[0].length;

        if (cur_row >= 0 && cur_row < row_length && cur_col >= 0 && cur_col < col_length 
            && maze[cur_row][cur_col] != '#' && !visited[cur_row][cur_col] ){
                return true;
            }
        return false;
    }

    private void printMaze(char[][] maze, List<int[]> path, int[] source, int[] destination) {
        for(int[] point: path){
            maze[point[0]][point[1]] = '.';
        }
        maze[source[0]][source[1]] = 's';
        maze[destination[0]][destination[1]] = 'f';

        for(int i=0; i<maze.length; i++){
            for (int j=0; j<maze[0].length; j++){
                System.out.print(maze[i][j] + " ");
            }
            System.out.println();
        }
    }  

    public static void main(String[] args){
    Random random = new Random();
    int startRow = 1;
    int startCol = random.nextInt(9) + 1;
    int endRow = 9;
    int endCol = random.nextInt(9);

    int[] source = {startRow, startCol};
    int[] destination = {endRow, endCol};

    Maze_Generator mazeGenerator = new Maze_Generator();
    mazeGenerator.generateMaze(startRow, startCol, endRow, endCol);
    char [][] maze = mazeGenerator.getMaze();

    Maze_Solver mazeSolver = new Maze_Solver();
    List<int[]> path = mazeSolver.findPath(maze, source, destination);
    if (path != null) {
        System.out.println("Path:");
        for (int[] point : path) {
            System.out.println(Arrays.toString(point));
        }
    }
    mazeSolver.printMaze(maze, path, source, destination);
    }  
}

import { join } from 'path';
import { Task1 } from './task1';
import { Task2 } from './task2';
import { Task3 } from './task3';

const baseDir = join(__dirname, '..', '..');

const task1Result = join(baseDir, 'output', 'task1-result.txt');
const task2Result = join(baseDir, 'output', 'task2-result.txt');
const task3Result = join(baseDir, 'output', 'task3-result.txt');

const task1 = new Task1(baseDir, task1Result);
task1.run();

const task2 = new Task2(task1Result, task2Result);
task2.run();

const task3 = new Task3(task1Result, task2Result, task3Result);
task3.run();




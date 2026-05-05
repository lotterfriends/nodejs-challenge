import { join } from 'path';
import { Task1 } from './task1';
import { Task2 } from './task2';
import { Task3 } from './task3';
import { Task4a } from './task4a';

const testing = true;

const baseDir = join(__dirname, '..', '..');

const task1Result = testing ? join(baseDir, 'clear_smaller.txt') : join(baseDir, 'output', 'task1-result.txt');
const task2Result = testing ? join(baseDir, 'output', 'testing-task2-result.txt') : join(baseDir, 'output', 'task2-result.txt');
const task3Result = testing ? join(baseDir, 'output', 'testing-task3-result.txt') : join(baseDir, 'output', 'task3-result.txt');
const task4aResult = testing ? join(baseDir, 'output', 'testing-task4a-result.json') : join(baseDir, 'output', 'task4a-result.json');

async function main() {
    const task1 = new Task1(baseDir, task1Result);
    await task1.run();

    const task2 = new Task2(task1Result, task2Result);
    await task2.run();

    const task3 = new Task3(task1Result, task2Result, task3Result);
    await task3.run();

    const task4a = new Task4a(task1Result, task4aResult);
    await task4a.run();
}

main();




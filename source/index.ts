import { join } from 'path';
import { Task1 } from './task1';

const baseDir = join(__dirname, '..', '..');

const task1 = new Task1(baseDir);
task1.run();
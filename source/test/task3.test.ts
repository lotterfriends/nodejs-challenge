import { describe, it, before, after } from 'node:test';
import * as assert from 'node:assert';
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Task3 } from '../task3';

const testDir = join(__dirname, '..', '..', '..', 'output', 'test-task3');

describe('Task3', () => {
    before(() => {
        mkdirSync(testDir, { recursive: true });
    });

    after(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    it('should calculate sum of digits + weighted vowels', async () => {
        const inputFile = join(testDir, 'input.txt');
        const task2ResultFile = join(testDir, 'task2-result.txt');
        const resultFile = join(testDir, 'result.txt');

        // "aeiou" -> a=2, e=4, i=8, o=16, u=32 -> vowelSum=62
        // task2Sum = 5
        // total = 5 + 62 = 67
        writeFileSync(inputFile, 'aeiou', 'utf8');
        writeFileSync(task2ResultFile, '5', 'utf8');

        const task = new Task3(inputFile, task2ResultFile, resultFile);
        await task.run();

        assert.strictEqual(existsSync(resultFile), true);
        const result = parseInt(readFileSync(resultFile, 'utf8').trim(), 10);
        assert.strictEqual(result, 67);
    });

    it('should handle uppercase vowels', async () => {
        const inputFile = join(testDir, 'input2.txt');
        const task2ResultFile = join(testDir, 'task2-result2.txt');
        const resultFile = join(testDir, 'result2.txt');

        // "AE" -> A=2, E=4 -> vowelSum=6
        // task2Sum = 10
        // total = 16
        writeFileSync(inputFile, 'AE', 'utf8');
        writeFileSync(task2ResultFile, '10', 'utf8');

        const task = new Task3(inputFile, task2ResultFile, resultFile);
        await task.run();

        const result = parseInt(readFileSync(resultFile, 'utf8').trim(), 10);
        assert.strictEqual(result, 16);
    });

    it('should skip calculation if result file already exists', async () => {
        const inputFile = join(testDir, 'input3.txt');
        const task2ResultFile = join(testDir, 'task2-result3.txt');
        const resultFile = join(testDir, 'result3.txt');

        writeFileSync(inputFile, 'aeiou', 'utf8');
        writeFileSync(task2ResultFile, '5', 'utf8');
        writeFileSync(resultFile, '99', 'utf8');

        const task = new Task3(inputFile, task2ResultFile, resultFile);
        await task.run();

        const result = readFileSync(resultFile, 'utf8').trim();
        assert.strictEqual(result, '99'); // unchanged
    });
});

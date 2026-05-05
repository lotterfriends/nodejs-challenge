import { describe, it, before, after } from 'node:test';
import * as assert from 'node:assert';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { Task2 } from '../task2';

const testDir = join(__dirname, '..', '..', '..', 'output', 'test-task2');

describe('Task2', () => {
    before(() => {
        mkdirSync(testDir, { recursive: true });
    });

    after(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    it('should calculate sum of all digits in a file', async () => {
        const inputFile = join(testDir, 'input.txt');
        const resultFile = join(testDir, 'result.txt');
        writeFileSync(inputFile, 'D1es 1st 31n Te4t.', 'utf8');

        const task = new Task2(inputFile, resultFile);
        await task.run();

        assert.strictEqual(existsSync(resultFile), true);
        const result = parseInt(require('fs').readFileSync(resultFile, 'utf8').trim(), 10);
        assert.strictEqual(result, 10); // 1+1+3+1+4 = 10
    });

    it('should skip calculation if result file already exists', async () => {
        const inputFile = join(testDir, 'input2.txt');
        const resultFile = join(testDir, 'result2.txt');
        writeFileSync(inputFile, '999', 'utf8');
        writeFileSync(resultFile, '42', 'utf8');

        const task = new Task2(inputFile, resultFile);
        await task.run();

        const result = require('fs').readFileSync(resultFile, 'utf8').trim();
        assert.strictEqual(result, '42'); // unchanged
    });

    it('should return 0 for text without digits', async () => {
        const inputFile = join(testDir, 'input3.txt');
        const resultFile = join(testDir, 'result3.txt');
        writeFileSync(inputFile, 'Hello World without digits', 'utf8');

        const task = new Task2(inputFile, resultFile);
        await task.run();

        const result = parseInt(require('fs').readFileSync(resultFile, 'utf8').trim(), 10);
        assert.strictEqual(result, 0);
    });
});

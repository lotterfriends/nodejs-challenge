import { describe, it, before, after } from 'node:test';
import * as assert from 'node:assert';
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Task4b } from '../task4b';

const testDir = join(__dirname, '..', '..', '..', 'output', 'test-task4b');

describe('Task4b', () => {
    before(() => {
        mkdirSync(testDir, { recursive: true });
    });

    after(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    it('should decode char codes to string', async () => {
        const task4aFile = join(testDir, 'task4a-result.json');
        const resultFile = join(testDir, 'result.txt');

        // [72, 101, 108, 108, 111] -> "Hello"
        writeFileSync(task4aFile, JSON.stringify([72, 101, 108, 108, 111]), 'utf8');

        const task = new Task4b(task4aFile, resultFile);
        await task.run();

        assert.strictEqual(existsSync(resultFile), true);
        const result = readFileSync(resultFile, 'utf8');
        assert.strictEqual(result, 'Hello');
    });

    it('should handle single character', async () => {
        const task4aFile = join(testDir, 'task4a-result2.json');
        const resultFile = join(testDir, 'result2.txt');

        writeFileSync(task4aFile, JSON.stringify([65]), 'utf8');

        const task = new Task4b(task4aFile, resultFile);
        await task.run();

        const result = readFileSync(resultFile, 'utf8');
        assert.strictEqual(result, 'A');
    });

    it('should skip calculation if result file already exists', async () => {
        const task4aFile = join(testDir, 'task4a-result3.json');
        const resultFile = join(testDir, 'result3.txt');

        writeFileSync(task4aFile, JSON.stringify([72, 105]), 'utf8');
        writeFileSync(resultFile, 'existing', 'utf8');

        const task = new Task4b(task4aFile, resultFile);
        await task.run();

        const result = readFileSync(resultFile, 'utf8');
        assert.strictEqual(result, 'existing'); // unchanged
    });

    it('should throw error if task4a result is not an array', async () => {
        const task4aFile = join(testDir, 'task4a-result4.json');
        const resultFile = join(testDir, 'result4.txt');

        writeFileSync(task4aFile, '{"not": "array"}', 'utf8');

        const task = new Task4b(task4aFile, resultFile);
        await assert.rejects(() => task.run(), { message: 'Task4a result is not an array.' });
    });
});

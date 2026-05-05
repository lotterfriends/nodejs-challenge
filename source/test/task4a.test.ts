import { describe, it, before, after } from 'node:test';
import * as assert from 'node:assert';
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Task4a } from '../task4a';

const testDir = join(__dirname, '..', '..', '..', 'output', 'test-task4a');

describe('Task4a', () => {
    before(() => {
        mkdirSync(testDir, { recursive: true });
    });

    after(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    it('should find top 10 sentence digit sums in order of appearance minus index', async () => {
        const inputFile = join(testDir, 'input.txt');
        const resultFile = join(testDir, 'result.json');

        // Sentences: "4abc." "8def." "1ghi." "9jkl." "2mno." "7pqr." "8stu."
        // Digit sums per sentence: [4, 8, 1, 9, 2, 7, 8]
        // Top 3 (only 7 sentences, but algorithm picks top 10 or less):
        // All 7 sorted desc: [9,8,8,7,4,2,1] -> top 7
        // In order of appearance: [4,8,1,9,2,7,8]
        // minus index: [4-0, 8-1, 1-2, 9-3, 2-4, 7-5, 8-6] = [4,7,-1,6,-2,2,2]
        writeFileSync(inputFile, '4abc.8def.1ghi.9jkl.2mno.7pqr.8stu.', 'utf8');

        const task = new Task4a(inputFile, resultFile);
        await task.run();

        assert.strictEqual(existsSync(resultFile), true);
        const result = JSON.parse(readFileSync(resultFile, 'utf8'));
        assert.deepStrictEqual(result, [4, 7, -1, 6, -2, 2, 2]);
    });

    it('should handle exactly 10 sentences', async () => {
        const inputFile = join(testDir, 'input2.txt');
        const resultFile = join(testDir, 'result2.json');

        // 10 sentences with digit sums: 1,2,3,4,5,6,7,8,9,10
        const sentences = '1.2.3.4.5.6.7.8.9.91.';
        writeFileSync(inputFile, sentences, 'utf8');

        const task = new Task4a(inputFile, resultFile);
        await task.run();

        assert.strictEqual(existsSync(resultFile), true);
        const result = JSON.parse(readFileSync(resultFile, 'utf8'));
        // sums: [1,2,3,4,5,6,7,8,9,10]
        // all 10 in order, minus index: [1-0,2-1,3-2,4-3,5-4,6-5,7-6,8-7,9-8,10-9]
        assert.deepStrictEqual(result, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });

    it('should pick only top 10 from more than 10 sentences', async () => {
        const inputFile = join(testDir, 'input3.txt');
        const resultFile = join(testDir, 'result3.json');

        // 12 sentences: sums = [1,5,2,9,3,8,4,7,6,11,12,10]
        const sentences = '1.5.2.9.3.8.4.7.6.92.93.91.';
        writeFileSync(inputFile, sentences, 'utf8');

        const task = new Task4a(inputFile, resultFile);
        await task.run();

        assert.strictEqual(existsSync(resultFile), true);
        const result = JSON.parse(readFileSync(resultFile, 'utf8'));
        // sums: [1,5,2,9,3,8,4,7,6,11,12,10]
        // top 10 by value desc: 12,11,10,9,8,7,6,5,4,3
        // their indices: 10,9,11,3,5,7,8,1,6,4
        // sorted by index (order of appearance): idx1(5),idx3(9),idx4(3),idx5(8),idx6(4),idx7(7),idx8(6),idx9(11),idx10(12),idx11(10)
        // Let me recalculate:
        // indexed sorted desc: (12,10),(11,9),(10,11),(9,3),(8,5),(7,7),(6,8),(5,1),(4,6),(3,4)
        // sorted by idx: (5,1),(9,3),(3,4),(8,5),(4,6),(7,7),(6,8),(11,9),(12,10),(10,11)
        // minus index: [5-0,9-1,3-2,8-3,4-4,7-5,6-6,11-7,12-8,10-9] = [5,8,1,5,0,2,0,4,4,1]
        assert.deepStrictEqual(result, [5, 8, 1, 5, 0, 2, 0, 4, 4, 1]);
    });

    it('should skip calculation if result file already exists', async () => {
        const inputFile = join(testDir, 'input4.txt');
        const resultFile = join(testDir, 'result4.json');

        writeFileSync(inputFile, '9.8.7.', 'utf8');
        writeFileSync(resultFile, '[1,2,3]', 'utf8');

        const task = new Task4a(inputFile, resultFile);
        await task.run();

        const result = readFileSync(resultFile, 'utf8').trim();
        assert.strictEqual(result, '[1,2,3]'); // unchanged
    });
});

import { describe, it, before, after } from 'node:test';
import * as assert from 'node:assert';
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { createCipheriv, randomBytes } from 'crypto';
import { gzipSync } from 'zlib';
import { Task1 } from '../task1';

const testDir = join(__dirname, '..', '..', '..', 'output', 'test-task1');

describe('Task1', () => {
    before(() => {
        mkdirSync(testDir, { recursive: true });
    });

    after(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    it('should decrypt and decompress to output file', async () => {
        const plaintext = 'Hello, this is a test message for Task1!';
        const compressed = gzipSync(Buffer.from(plaintext, 'utf8'));

        const key = 'abcdefghijklmnopqrstuvwxyz123456'; // 32 chars
        const iv = randomBytes(12);

        const cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'utf8'), iv);
        const encrypted = Buffer.concat([cipher.update(compressed), cipher.final()]);
        const authTag = cipher.getAuthTag();

        writeFileSync(join(testDir, 'secret.key'), key, 'utf8');
        writeFileSync(join(testDir, 'iv.txt'), iv);
        writeFileSync(join(testDir, 'auth.txt'), authTag);
        writeFileSync(join(testDir, 'secret.enc'), encrypted);

        const resultFile = join(testDir, 'output.txt');
        const task = new Task1(testDir, resultFile);
        await task.run();

        assert.strictEqual(existsSync(resultFile), true);
        const result = readFileSync(resultFile, 'utf8');
        assert.strictEqual(result, plaintext);
    });

    it('should skip if output file already exists', async () => {
        const resultFile = join(testDir, 'output2.txt');
        writeFileSync(resultFile, 'already here', 'utf8');

        const task = new Task1(testDir, resultFile);
        await task.run();

        const result = readFileSync(resultFile, 'utf8');
        assert.strictEqual(result, 'already here'); // unchanged
    });
});

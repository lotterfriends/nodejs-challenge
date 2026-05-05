import { createReadStream, existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { Task } from './task.interface';

export class Task4 implements Task {

    constructor(private task1Result: string, private task4aResult: string) {
    }

    async run(): Promise<void> {
        if (existsSync(this.task4aResult) && statSync(this.task4aResult).size > 0) {
            const result = readFileSync(this.task4aResult, 'utf8').trim();
            console.log('Task4a result already exists:', this.task4aResult);
            console.log('Task4a Ergebnis:', result);
            return;
        }

        const stream = createReadStream(this.task1Result, { encoding: 'utf8', highWaterMark: 64 * 1024 });
        const sentenceSums: number[] = [];
        let currentSum = 0;

        await new Promise<void>((resolve, reject) => {
            stream.on('data', (chunk: string) => {
                for (const ch of chunk) {
                    if (ch === '.' || ch === '?' || ch === '!') {
                        sentenceSums.push(currentSum);
                        currentSum = 0;
                    } else if (ch >= '0' && ch <= '9') {
                        currentSum += ch.charCodeAt(0) - 48;
                    }
                }
            });

            stream.on('end', () => {
                // Last sentence if not terminated
                if (currentSum > 0) {
                    sentenceSums.push(currentSum);
                }

                // Find the 10 largest values
                const sorted = [...sentenceSums].sort((a, b) => b - a);
                const top10Values = sorted.slice(0, 10);
                const minThreshold = top10Values[top10Values.length - 1];

                // Collect the top 10 in order of appearance
                const top10InOrder: { index: number; value: number }[] = [];
                for (let i = 0; i < sentenceSums.length && top10InOrder.length < 10; i++) {
                    if (sentenceSums[i] >= minThreshold) {
                        top10InOrder.push({ index: i, value: sentenceSums[i] });
                    }
                }

                // Sort by value descending to pick exactly the top 10, then restore order
                // We need exactly the 10 largest, in order of appearance
                const indexed = sentenceSums.map((value, idx) => ({ value, idx }));
                indexed.sort((a, b) => b.value - a.value || a.idx - b.idx);
                const top10 = indexed.slice(0, 10);
                // Sort back by original index (order of appearance)
                top10.sort((a, b) => a.idx - b.idx);

                // Subtract index in the array from each value
                const result = top10.map((item, i) => item.value - i);

                writeFileSync(this.task4aResult, JSON.stringify(result), 'utf8');
                console.log('Task4a Ergebnis:', JSON.stringify(result));
                resolve();
            });

            stream.on('error', (err) => {
                console.error('Error reading file:', err);
                reject(err);
            });
        });
    }
}

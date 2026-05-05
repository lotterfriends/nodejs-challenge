import { BaseTask } from './base-task';

export class Task4a extends BaseTask {

    protected taskName = 'Task4a';

    constructor(private task1Result: string, private task4aResult: string) {
        super();
    }

    private collectSentenceSums(chunk: string, state: { currentSum: number; sums: number[] }): void {
        for (const ch of chunk) {
            if (ch === '.' || ch === '?' || ch === '!') {
                state.sums.push(state.currentSum);
                state.currentSum = 0;
            } else if (ch >= '0' && ch <= '9') {
                state.currentSum += ch.charCodeAt(0) - 48;
            }
        }
    }

    private findTop10InOrder(sentenceSums: number[]): number[] {
        const indexed = sentenceSums.map((value, idx) => ({ value, idx }));
        indexed.sort((a, b) => b.value - a.value || a.idx - b.idx);
        const top10 = indexed.slice(0, 10);
        top10.sort((a, b) => a.idx - b.idx);
        return top10.map((item, i) => item.value - i);
    }

    async run(): Promise<void> {
        if (this.resultExists(this.task4aResult)) {
            const result = this.readResult(this.task4aResult);
            console.log('Task4a result already exists:', this.task4aResult);
            console.log('Task4a result:', result);
            return;
        }

        this.checkDependency(this.task1Result, 'Task1');

        const state = { currentSum: 0, sums: [] as number[] };

        await this.streamFile(this.task1Result, (chunk) => {
            this.collectSentenceSums(chunk, state);
        });

        if (state.currentSum > 0) {
            state.sums.push(state.currentSum);
        }

        const result = this.findTop10InOrder(state.sums);
        this.writeResult(this.task4aResult, JSON.stringify(result));
        console.log('Task4a result:', JSON.stringify(result));
    }
}

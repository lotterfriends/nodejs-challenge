import { BaseTask } from './base-task';

export class Task3 extends BaseTask {

    protected taskName = 'Task3';

    private static readonly VOWEL_VALUES: Record<string, number> = {
        a: 2, e: 4, i: 8, o: 16, u: 32
    };

    constructor(private task1Result: string, private task2Result: string, private task3Result: string) {
        super();
    }

    private sumVowels(chunk: string): number {
        let sum = 0;
        for (const ch of chunk) {
            const lower = ch.toLowerCase();
            if (lower in Task3.VOWEL_VALUES) {
                sum += Task3.VOWEL_VALUES[lower];
            }
        }
        return sum;
    }

    async run(): Promise<void> {
        if (this.resultExists(this.task3Result)) {
            const result = this.readResult(this.task3Result);
            console.log('Task3 result already exists:', this.task3Result);
            console.log('Task3 result (sum of digits + vowels):', result);
            return;
        }

        this.checkDependency(this.task1Result, 'Task1');
        this.checkDependency(this.task2Result, 'Task2');

        const task2Sum = parseInt(this.readResult(this.task2Result), 10);
        let vowelSum = 0;

        await this.streamFile(this.task1Result, (chunk) => {
            vowelSum += this.sumVowels(chunk);
        });

        const total = task2Sum + vowelSum;
        this.writeResult(this.task3Result, String(total));
        console.log('Task3 result (sum of digits + vowels):', total);
    }
}

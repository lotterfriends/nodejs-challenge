import { BaseTask } from './base-task';

export class Task2 extends BaseTask {

    protected taskName = 'Task2';

    constructor(private task1Result: string, private task2Result: string) {
        super();
    }

    private sumDigits(chunk: string): number {
        let sum = 0;
        for (const ch of chunk) {
            if (ch >= '0' && ch <= '9') {
                sum += ch.charCodeAt(0) - 48;
            }
        }
        return sum;
    }

    async run(): Promise<void> {
        if (this.resultExists(this.task2Result)) {
            const result = this.readResult(this.task2Result);
            console.log('Task2 result already exists:', this.task2Result);
            console.log('Sum of all digits:', result);
            return;
        }

        this.checkDependency(this.task1Result, 'Task1');

        let sum = 0;
        await this.streamFile(this.task1Result, (chunk) => {
            sum += this.sumDigits(chunk);
        });

        this.writeResult(this.task2Result, String(sum));
        console.log('Sum of all digits:', sum);
    }
}
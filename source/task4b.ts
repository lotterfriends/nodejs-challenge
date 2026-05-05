import { BaseTask } from './base-task';

export class Task4b extends BaseTask {

    protected taskName = 'Task4b';

    constructor(private task4aResult: string, private task4bResult: string) {
        super();
    }

    private decodeCharCodes(values: number[]): string {
        return values.map(e => String.fromCharCode(e)).join('');
    }

    async run(): Promise<void> {
        if (this.resultExists(this.task4bResult)) {
            const result = this.readResult(this.task4bResult);
            console.log('Task4b result already exists:', this.task4bResult);
            console.log('Task4b result:', result);
            return;
        }

        this.checkDependency(this.task4aResult, 'Task4a');

        const parsed = JSON.parse(this.readResult(this.task4aResult));
        if (!Array.isArray(parsed)) {
            throw new Error('Task4a result is not an array.');
        }

        const solution = this.decodeCharCodes(parsed);
        this.writeResult(this.task4bResult, solution);
        console.log('Task4b result:', solution);
    }
}

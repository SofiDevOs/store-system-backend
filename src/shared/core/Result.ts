export class Result<T, E> {
    public data?: T;
    public error?: E;
    private isSuccess: boolean;

    private constructor(isSuccess: boolean, data?: T, error?: E) {
        this.isSuccess = isSuccess;
        this.data = data;
        this.error = error;
    }

    public static ok<T, E>(data: T): Result<T, E> {
        return new Result<T, E>(true, data);
    }

    public static fail<T, E>(error: E): Result<T, E> {
        return new Result<T, E>(false, undefined, error);
    }

    public isOk(): this is Result<T, never> {
        return this.isSuccess;
    }

    public isErr(): this is Result<never, E> {
        return !this.isSuccess;
    }

    public unwrap(): T {
        if (!this.isOk()) {
            throw new Error("Cannot unwrap a failed Result");
        }
        return this.data!;
    }

    public unwrapErr(): E {
        if (!this.isErr()) {
            throw new Error("Cannot unwrap error from a successful Result");
        }
        return this.error!;
    }

    public getDataOr(defaultValue: T): T {
        if (this.isOk()) {
            return this.data!;
        }
        return defaultValue;
    }

    public fold<U>(onSuccess: (data: T) => U, onFailure: (error: E) => U): U {
        if (this.isOk()) {
            return onSuccess(this.data!);
        } else {
            return onFailure(this.error!);
        }
    }
}

export class Result<T, E> {
    private data?: T;
    private error?: E;
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

    public isSuccessful(): boolean {
        return this.isSuccess;
    }

    public getData(): T{
        //  Se que en alguna parte puse que no deberiamos de tirar errores (throws) a cada rato
        //  pero en este caso es necesario para evitar que se intente acceder a los datos de un resultado fallido
        //  como tal es un error de programacion no un error de negocio
        //  lo cual indicaria un error de logica en el codigo que esta usando el Result.
        if (!this.isSuccess || this.data === undefined) {
            throw new Error("Cannot get data from a failed Result");
        }
        return this.data;
    }

    public getError(): E {
        if (this.isSuccess || this.error === undefined) {
            throw new Error("Cannot get error from a successful Result");
        }
        return this.error;
    }


    public fold<U>(onSuccess: (data: T) => U, onFailure: (error: E) => U): U {
        if (this.isSuccess && this.data !== undefined) {
            return onSuccess(this.data);
        } else if (!this.isSuccess && this.error !== undefined) {
            return onFailure(this.error);
        }
        throw new Error("Invalid Result state");
    }
}

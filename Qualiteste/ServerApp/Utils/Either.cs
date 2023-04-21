namespace Qualiteste.ServerApp.Utils
{
    public class Either<L, R>
    {
        private readonly L error;
        private readonly R success;
        private readonly bool isError;
        public Either(L error)
        {
            this.error = error;
            this.isError = true;
        }

        public Either(R success)
        {
            this.success = success;
            this.isError = false;
        }

        public T Match<T>(Func<L, T> leftFunc, Func<R, T> rightFunc)
            => this.isError ? leftFunc(this.error) : rightFunc(this.success);

        public static implicit operator Either<L, R>(L error) => new Either<L,R>(error);
        public static implicit operator Either<L, R>(R success) => new Either<L, R>(success);
    }

}

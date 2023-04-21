namespace Qualiteste.ServerApp.Utilities
{
    public abstract class Either<TLeft, TRight>
    {
        private Either()
        {

        }
        public sealed class Error<L> : Either<L, object>
        {
            public L Value { get; }

            public Error(L value) {
                Value = value;
            }
        }

        public sealed class Success<R> : Either<object, R> { 
            public R Value { get; }

            public Success(R value)
            {
                Value = value;
            }
        }
    }
}

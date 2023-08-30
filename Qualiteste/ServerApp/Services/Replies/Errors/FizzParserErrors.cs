namespace Qualiteste.ServerApp.Services.Replies.Errors
{
    public abstract class FizzParserErrors : CustomError
    {
        protected FizzParserErrors(string? message, int statusCode) : base(message, statusCode)
        {
        }
        public class InvalidFizzResultFormat : CustomError
        {
            public InvalidFizzResultFormat() : base("Formatação do ficheiro não obedece aos requisitos", 400)
            {
            }
        }
    }
    
}

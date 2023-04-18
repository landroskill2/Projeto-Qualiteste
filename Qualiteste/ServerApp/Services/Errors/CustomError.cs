namespace Qualiteste.ServerApp.Services.Errors
{
    public class CustomError : Exception
    {
        public CustomError(string? message, int statusCode) : base(message)
        {
            StatusCode = statusCode;
        }
        public override string Message => base.Message;

        public int StatusCode { get; set; }
    }
}

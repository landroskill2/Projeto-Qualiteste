namespace Qualiteste.ServerApp.Services.Errors
{
    public class CustomError
    {
        public CustomError(string? message, int statusCode)
        {
            StatusCode = statusCode;
            Message = message;
        }
        public string Message { get; set; }

    public int StatusCode { get; set; }
    }
}

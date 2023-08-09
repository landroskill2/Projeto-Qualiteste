namespace Qualiteste.ServerApp.Services.Replies.Errors
{
    public class CustomError : CustomReply
    {
        public CustomError(string? message, int statusCode) : base(message, statusCode)
        {
        }
    }
}

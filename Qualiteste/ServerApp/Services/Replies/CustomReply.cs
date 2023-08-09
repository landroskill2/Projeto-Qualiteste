namespace Qualiteste.ServerApp.Services.Replies
{
    public class CustomReply
    {
        public CustomReply(string? message, int statusCode)
        {
            StatusCode = statusCode;
            Message = message;
        }
        public string Message { get; set; }

        public int StatusCode { get; set; }
    }
}

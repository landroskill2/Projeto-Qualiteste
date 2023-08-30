using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Services.Replies.Successes
{
    public abstract class AccountSuccesses : CustomSuccess
    {
        protected AccountSuccesses(string? message, int statusCode) : base(message, statusCode)
        {
        }

        public class LoginSuccess : AccountSuccesses
        {
            public LoginSuccess(string? idToken) : base(idToken, 200)
            {
            }
        }
        public class CreateAccountSuccess : AccountSuccesses
        {
            public CreateAccountSuccess(string username) : base("Utilizador " + username + " criado com sucesso", 201)
            {
            }
        }
    }

    
}

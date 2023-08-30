namespace Qualiteste.ServerApp.Services.Replies.Errors
{

    public abstract class AccountErrors : CustomError
    {
        protected AccountErrors(string? message, int statusCode) : base(message, statusCode)
        {
        }
        public class UsernameNotFound : AccountErrors
        {
            public UsernameNotFound() : base("Username incorreto.", 404)
            {
            }
        }

        public class IncorrectPassword : AccountErrors
        {
            public IncorrectPassword() : base("Password incorreta.", 401)
            {
            }
        }

        public class MissingFieldsOnUserCreation : AccountErrors
        {
            public MissingFieldsOnUserCreation() : base("Campos insuficientes para criar o utilizador.", 400)
            {
            }
        }
    }

    
}

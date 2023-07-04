namespace Qualiteste.ServerApp.Services.Errors
{
    public class UsernameNotFound : CustomError
    {
        public UsernameNotFound() : base("Username incorreto.", 404)
        {
        }
    }

    public class IncorrectPassword : CustomError
    {
        public IncorrectPassword() : base("Password incorreta.", 401)
        {
        }
    }
}

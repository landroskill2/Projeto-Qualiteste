namespace Qualiteste.ServerApp.Services.Errors
{
    public class NoSessionFoundWithId : CustomError
    {
        public NoSessionFoundWithId() : base("Não foi possivel encontrar uma sessão com o id especificado", 404)
        {

        }

    }

    public class SessionIdIsToLong : CustomError
    {
        public SessionIdIsToLong() : base("Não foi possivel criar uma sessão com o id especificado", 400)
        {

        }

    }

    public class SessionWithConflictingID : CustomError
    {
        public SessionWithConflictingID() : base("Não foi possivel criar uma sessão com o id especificado, já se encontra em uso", 400)
        {

        }

    }

}

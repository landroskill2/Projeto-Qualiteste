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

    public class TestAlreadyBelongsToASession : CustomError
    {
        public TestAlreadyBelongsToASession() : base("Não foi possível adicionar o teste à sessão. O teste já pertence a uma sessão.", 409)
        {
            
        }
    }

    public class ConsumerAlreadyInSession : CustomError
    {
        public ConsumerAlreadyInSession() : base("O provador já se encontra nesta sessão.", 409)
        {
            
        }
    }

}

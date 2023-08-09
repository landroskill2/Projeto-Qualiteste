namespace Qualiteste.ServerApp.Services.Replies.Errors
{
    public abstract class SessionErrors : CustomError
    {
        protected SessionErrors(string? message, int statusCode) : base(message, statusCode)
        {
        }


        public class NoSessionFoundWithId : SessionErrors
        {
            public NoSessionFoundWithId() : base("Não foi possivel encontrar uma sessão com o id especificado", 404)
            {

            }

        }

        public class SessionIdIsToLong : SessionErrors
        {
            public SessionIdIsToLong() : base("Não foi possivel criar uma sessão com o id especificado", 400)
            {

            }

        }

        public class SessionWithConflictingID : SessionErrors
        {
            public SessionWithConflictingID() : base("Não foi possivel criar uma sessão com o id especificado, já se encontra em uso", 400)
            {

            }

        }

        public class TestAlreadyBelongsToASession : SessionErrors
        {
            public TestAlreadyBelongsToASession() : base("Não foi possível adicionar o teste à sessão. O teste já pertence a uma sessão.", 409)
            {

            }
        }

        public class ConsumerAlreadyInSession : SessionErrors
        {
            public ConsumerAlreadyInSession() : base("O provador já se encontra nesta sessão.", 409)
            {

            }
        }

        public class InvalidSessionTimeValue : SessionErrors
        {
            public InvalidSessionTimeValue() : base("Não foi possível processar o valor da hora da sessão.", 400)
            {

            }
        }

        public class InvalidQueryParameterValue : SessionErrors
        {
            public InvalidQueryParameterValue() : base("Não foi possível processar o valor da query recebida.", 400)
            {

            }
        }

        public class ConsumerIsNotPresentInSession : SessionErrors
        {
            public ConsumerIsNotPresentInSession() : base("O consumidor não se encontra convidado para esta sessão", 404)
            {

            }
        }
    }


}

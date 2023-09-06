namespace Qualiteste.ServerApp.Services.Replies.Errors
{

    public abstract class ConsumerErrors : CustomError
    {
        protected ConsumerErrors(string? message, int statusCode) : base(message, statusCode)
        {
        }
        public class NoConsumerFoundWithId : ConsumerErrors
        {
            public NoConsumerFoundWithId() : base("Não foi possivel encontrar um consumidor com o id especificado", 404)
            {

            }
        }

        public class ConsumerWithIdAlreadyPresent : ConsumerErrors
        {
            public ConsumerWithIdAlreadyPresent() : base("Não foi possivel criar um consumidor, id já se encontra em uso", 409)
            {

            }
        }
        public class ConsumerWithContactAlreadyPresent : ConsumerErrors
        {
            public ConsumerWithContactAlreadyPresent() : base("Não foi possivel criar um consumidor, contacto já se encontra em uso", 409)
            {

            }
        }

        public class ConsumerWithNifAlreadyPresent : ConsumerErrors
        {
            public ConsumerWithNifAlreadyPresent() : base("Não foi possivel criar um consumidor, NIF já se encontra em uso", 409)
            {

            }
        }


        public class ConsumerFilterNotValid : ConsumerErrors
        {
            public ConsumerFilterNotValid() : base("Um dos Filtros usados não é valido", 400)
            {

            }
        }

        public class CannotDeleteConsumer : ConsumerErrors
        {
            public CannotDeleteConsumer() : base(
                    "Não é possível eliminar o consumidor pois este encontra-se em uso por outros recursos.",
                    409
                )
            {
            }
        }
    }

}

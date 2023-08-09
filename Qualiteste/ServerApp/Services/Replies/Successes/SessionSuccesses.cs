namespace Qualiteste.ServerApp.Services.Replies.Successes
{
    public abstract class SessionSuccesses : CustomSuccess
    {
        public SessionSuccesses(string? message, int statusCode) : base(message, statusCode)
        {
        }

        public class AddConsumerToSessionSuccess : SessionSuccesses
        {
            public AddConsumerToSessionSuccess() : base("Consumidores adicionados à sessão com sucesso.", 200)
            {
            }
        }

        public class AddTestToSessionSuccess : SessionSuccesses
        {
            public AddTestToSessionSuccess() : base("Teste adicionado à sessão com sucesso.", 200)
            {
            }
        }

        public class RemoveInvitedConsumerFromSessionSuccess : SessionSuccesses
        {
            public RemoveInvitedConsumerFromSessionSuccess() : base("Consumidor removido da sessão com sucesso", 200)
            {
            }
        }

        public class ConfirmConsumerSuccess : SessionSuccesses
        {
            public ConfirmConsumerSuccess() : base("Consumidor confirmado para a sessão com sucesso", 200)
            {
            }
        }
    }
}

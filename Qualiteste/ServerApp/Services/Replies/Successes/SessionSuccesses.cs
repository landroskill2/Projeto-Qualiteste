using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Utils;

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
            public RemoveInvitedConsumerFromSessionSuccess() : base("Consumidor removido da sessão com sucesso.", 200)
            {
            }
        }

        public class ConfirmConsumerSuccess : SessionSuccesses
        {
            public ConfirmConsumerSuccess() : base("Consumidor confirmado para a sessão com sucesso.", 200)
            {
            }
        }

        public class UpdateAttendanceSuccess : SessionSuccesses
        {
            public UpdateAttendanceSuccess() : base("Presença do consumidor actualizada com sucesso.", 200)
            {
            }
        }

        public class RemoveConfirmedConsumerFromSessionSuccess : SessionSuccesses
        {
            public RemoveConfirmedConsumerFromSessionSuccess() : base("Consumidor removido da sessão com sucesso.", 200)
            {
            }
        }

        public class SessionDeletedSuccessfully : SessionSuccesses
        {
            public SessionDeletedSuccessfully() : base("A sessão foi eliminada com sucesso.", 200)
            {
            }
        }
    }
}

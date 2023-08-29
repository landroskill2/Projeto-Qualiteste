namespace Qualiteste.ServerApp.Services.Replies.Successes
{
    public abstract class TestSucesses : CustomSuccess
    {
        protected TestSucesses(string? message, int statusCode) : base(message, statusCode)
        {
        }

        public class UpdateAttributeAliasSuccess : TestSucesses
        {
            public UpdateAttributeAliasSuccess() : base("Atributos actualizados com sucesso", 200)
            {
            }
        }
        public class AddConsumerToTestSuccess : TestSucesses
        {
            public AddConsumerToTestSuccess() : base("Consumidor adicionado ao teste com sucesso", 200)
            {
            }
        }
        public class RemoveResultsSuccess : TestSucesses
        {
            public RemoveResultsSuccess() : base("Resultados eliminados do teste com sucesso", 200)
            {
            }
        }

    }
}

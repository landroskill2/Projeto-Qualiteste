namespace Qualiteste.ServerApp.Services.Replies.Successes
{
    public abstract class TestSuccesses : CustomSuccess
    {
        protected TestSuccesses(string? message, int statusCode) : base(message, statusCode)
        {
        }

        public class UpdateAttributeAliasSuccess : TestSuccesses
        {
            public UpdateAttributeAliasSuccess() : base("Atributos actualizados com sucesso", 200)
            {
            }
        }
        public class AddConsumerToTestSuccess : TestSuccesses
        {
            public AddConsumerToTestSuccess() : base("Consumidor adicionado ao teste com sucesso", 200)
            {
            }
        }
        public class RemoveResultsSuccess : TestSuccesses
        {
            public RemoveResultsSuccess() : base("Resultados eliminados do teste com sucesso", 200)
            {
            }
        }
        public class FileUploadSuccess : TestSuccesses
        {
            public FileUploadSuccess() : base("Ficheiro processado com sucesso.", 201)
            {
            }
        }
        public class TestDeletedSuccessfully : TestSuccesses
        {
            public TestDeletedSuccessfully() : base("O teste foi eliminado com sucesso.", 200)
            {
            }
        }
    }
}

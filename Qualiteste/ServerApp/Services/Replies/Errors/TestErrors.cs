using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services.Replies.Errors
{

    public abstract class TestErrors : CustomError
    {
        protected TestErrors(string? message, int statusCode) : base(message, statusCode)
        {
        }

        public class NoTestFoundWithGivenID : TestErrors
        {
            public NoTestFoundWithGivenID() : base("Não foi possível encontrar um Teste com o id especificado", 404)
            {

            }
        }

        public class TestReferencesNonExistingProduct : TestErrors
        {
            public TestReferencesNonExistingProduct() : base("Não foi possível encontrar o produto com o Id especificado", 404)
            {

            }
        }

        public class TestResultsReferencesNonExistingConsumer : TestErrors
        {
            public TestResultsReferencesNonExistingConsumer() : base("Os resultados referem consumidores que não existem no sistema.", 409)
            {

            }
        }

        public class TestWithSameIdAlreadyPresent : TestErrors
        {
            public TestWithSameIdAlreadyPresent() : base("Ja existe um teste com o ID especificado", 409)
            {

            }
        }

        public class TestFieldIsToLong : TestErrors
        {
            public TestFieldIsToLong() : base("Campo no teste criado é demasiado comprido", 409)
            {

            }
        }
        public class InvalidTestType : TestErrors
        {
            public InvalidTestType() : base("Tipo de teste especificado é invalido, tem que ser 'HT' ou 'SP'", 400)
            {

            }
        }

        public class CannotDeleteTest : TestErrors
        {
            public CannotDeleteTest() : base("Teste possui resultados ou está associado a uma sessão, não é possível eliminar o recurso.", 409)
            {
            }
        }


        public class ConsumerAlreadyInTest : TestErrors
        {
            public ConsumerAlreadyInTest() : base("O provador já se encontra neste teste", 409)
            {

            }
        }

        public class SamplePresentationPositionOverlapping : TestErrors
        {
            public SamplePresentationPositionOverlapping() : base("Ordem de apresentação das amostras está em conflito, verifique a ordem de apresentação.", 409)
            {
            }
        }

        public class SampleRefersNonExistingProduct : TestErrors
        {
            public SampleRefersNonExistingProduct() : base("Amostra referência um produto que não existe.", 409)
            {
            }
        }

        public class TestHasNoSamples : TestErrors
        {
            public TestHasNoSamples() : base("O teste não possui amostras.", 400)
            {
            }
        }
        public class InvalidClientId : TestErrors
        {
            public InvalidClientId() : base("ClientId tem que estar definido.", 400)
            {
            }
        }

        public class TestMustBeAssociatedWithSession : TestErrors
        {
            public TestMustBeAssociatedWithSession() : base("O teste tem de estar associado a uma sessão.", 403)
            {
            }
        }
    }

}

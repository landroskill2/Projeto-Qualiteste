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


        //Criar erros para quando se tenta mudar um campo do teste que não pode ser alterado
        public class TestPropertyCannotBeChanged : TestErrors
        {
            public TestPropertyCannotBeChanged() : base("TODO", 999)
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
    }

}

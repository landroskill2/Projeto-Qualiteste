namespace Qualiteste.ServerApp.Services.Errors
{
    public class NoTestFoundWithGivenID : CustomError
    {
        public NoTestFoundWithGivenID() : base("Não foi possível encontrar um Teste com o id especificado", 404)
        {
                
        }
    }

    public class TestReferencesNonExistingProduct : CustomError
    {
        public TestReferencesNonExistingProduct() : base("Não foi possível encontrar o produto com o Id especificado", 404)
        {

        }
    }

    public class TestWithSameIdAlreadyPresent : CustomError
    {
        public TestWithSameIdAlreadyPresent() : base("Ja existe um teste com o ID especificado", 409)
        {

        }
    }

    public class TestFieldIsToLong : CustomError
    {
        public TestFieldIsToLong() : base("Campo no teste criado é demasiado comprido", 409)
        {

        }
    }
    public class InvalidTestType : CustomError
    {
        public InvalidTestType() : base("Tipo de teste especificado é invalido, tem que ser 'HT' ou 'SP'", 400)
        {

        }
    }


    //Criar erros para quando se tenta mudar um campo do teste que não pode ser alterado
    public class TestPropertyCannotBeChanged : CustomError
    {
        public TestPropertyCannotBeChanged() : base("TODO", 999)
        {
                
        }
    }

    public class ConsumerAlreadyInTest : CustomError
    {
        public ConsumerAlreadyInTest() : base("O provador já se encontra neste teste", 409)
        {

        }
    }
}

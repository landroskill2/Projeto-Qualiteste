namespace Qualiteste.ServerApp.Services.Errors
{
    public class ProductWithIdAlreadyPresent : CustomError
    {
        public ProductWithIdAlreadyPresent() : base("Não foi possivel criar o produto com id especificado, o id já se encontra presente", 409) 
        {
            
        }
    }
}

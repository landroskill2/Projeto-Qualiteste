namespace Qualiteste.ServerApp.Services.Errors
{
    public class ProductWithRefAlreadyPresent : CustomError
    {
        public ProductWithRefAlreadyPresent() : base("Não foi possivel criar o produto com a referencia especificada, a referecia já se encontra presente", 409) 
        {
            
        }
    }
}

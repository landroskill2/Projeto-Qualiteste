namespace Qualiteste.ServerApp.Services.Replies.Errors
{

    public abstract class ProductErrors : CustomError
    {
        protected ProductErrors(string? message, int statusCode) : base(message, statusCode)
        {
        }

        public class ProductWithRefAlreadyPresent : ProductErrors
        {
            public ProductWithRefAlreadyPresent() : base("Não foi possivel criar o produto com a referencia especificada, a referência já se encontra presente", 409)
            {

            }
        }
    }
}

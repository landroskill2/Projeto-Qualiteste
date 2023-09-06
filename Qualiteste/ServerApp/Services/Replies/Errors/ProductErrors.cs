using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;

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

        public class NoProductFoundWithId : ProductErrors
        {
            public NoProductFoundWithId() : base("Não foi possivel encontrar um produto com o id especificado", 404)
            {

            }
        }

        public class ProductUsedAsSample : ProductErrors
        {
            public ProductUsedAsSample() : base("Não é possível apagar produtos em amostragem", 409)
            {
                
            }
        }
    }
}

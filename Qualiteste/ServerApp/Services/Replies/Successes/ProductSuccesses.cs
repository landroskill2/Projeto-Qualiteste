using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services.Replies.Successes
{

    public abstract class ProductSuccesses : CustomSuccess
    {
        protected ProductSuccesses(string? message, int statusCode) : base(message, statusCode)
        {
        }

        public class CreateProductSuccess : ProductSuccesses
        {
            public CreateProductSuccess() : base("Produto criado com sucesso.", 201)
            {
            }
        }

        public class ProductDeletedSuccessfully : ProductSuccesses
        {
            public ProductDeletedSuccessfully() : base("Produto apagado com sucesso.", 200)
            {
                
            }
        }
    }

    
}

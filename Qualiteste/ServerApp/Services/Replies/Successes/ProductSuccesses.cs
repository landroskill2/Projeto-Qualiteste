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
    }

    
}

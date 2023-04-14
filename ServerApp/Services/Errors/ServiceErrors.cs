namespace Qualiteste.ServerApp.Services.Errors
{
    public class NoConsumerFoundWithId : CustomError
    {
        public NoConsumerFoundWithId() : base("Não foi possivel encontrar um funcionário com o id especificado", 404)
        {
           
        }
    }
}

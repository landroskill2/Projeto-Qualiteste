namespace Qualiteste.ServerApp.Services.Errors
{
    public class NoSessionFoundWithId : CustomError
    {
        public NoSessionFoundWithId() : base("Não foi possivel encontrar uma sessão  com o id especificado", 404)
        {

        }
    }

}

using Qualiteste.ServerApp.Dtos;

namespace Qualiteste.ServerApp.Models;

public partial class Session
{
    public SessionOutputModel toOutputModel()
    {
        return new SessionOutputModel
        {
            Id = Sessionid,
            Date = Sessiondate,
            ConsumersNumber = Consumersnumber,
        };
    }
}
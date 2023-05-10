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

public partial class ConsumerSession
{
    public ConsumerSessionOutputModel toOutputModel()
    {
        return new ConsumerSessionOutputModel
        {
            Consumer = Consumer.ToOutputModel(),
            Contacteddate = Contacteddate,
            Confirmationdate = Confirmationdate,
            Sessiontime = Sessiontime,
            Attendance = Attendance,
            Stampdate = Stampdate
        };
    }
}
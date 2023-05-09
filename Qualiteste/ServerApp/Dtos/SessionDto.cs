using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public class SessionOutputModel
    {
        public string Id { get; set; }
        public DateOnly Date { get; set; }
        public int ConsumersNumber { get; set; }
    }

    public class SessionInputModel
    {
        public string Id { get; set; }
        public DateOnly Date { get; set; }
        public int ConsumersNumber { get; set; }

        public Session toDbSession()
        {

            return new Session
            {
                Sessionid = Id,
                Sessiondate = Date,
                Consumersnumber = ConsumersNumber,
            };
        }
    }

    public class ConsumerSessionOutputModel
    {
        public ConsumerOutputModel Consumer { get; set;}
        public DateOnly? Contacteddate { get; set; }
        public DateOnly? Confirmationdate { get; set; }
        public TimeOnly? Sessiontime { get; set; }
        public bool? Attendance { get; set; }
        public DateOnly? Stampdate { get; set; }

    }

    public class SessionPageModel
    {
        public SessionOutputModel Session { get; set; }
        public List<ConsumerSessionOutputModel> Consumers { get; set; }
        public List<TestOutputModel> Tests { get; set; }
    }
}

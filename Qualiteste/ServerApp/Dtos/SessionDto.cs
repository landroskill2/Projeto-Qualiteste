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
        public int ConsumersNumber { get; set;}

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
}

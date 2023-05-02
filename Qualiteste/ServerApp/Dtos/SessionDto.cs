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
        public DateOnly Date { get; set; }
        public int ConsumersNumber { get; set;}

        public Session toDbSession()
        {
            string id = "" + Date.Day.ToString() + Date.Month.ToString() + Date.Year.ToString();

            return new Session
            {
                Sessionid = id,
                Sessiondate = Date,
                Consumersnumber = ConsumersNumber,
            };
        }
    }
}

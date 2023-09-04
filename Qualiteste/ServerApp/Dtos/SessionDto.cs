using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public record SessionOutputModel
    {
        public string Id { get; init; }
        public DateOnly Date { get; init; }
        public int ConsumersNumber { get; init; }
    }

    public record SessionInputModel
    {
        public string Id { get; init; }
        public DateOnly Date { get; init; }
        public int ConsumersNumber { get; init; }

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

    public record ConsumerSessionOutputModel
    {
        public ConsumerOutputModel Consumer { get; init;}
        public DateOnly? Contacteddate { get; init; }
        public DateOnly? Confirmationdate { get; init; }
        public TimeOnly? Sessiontime { get; init; }
        public bool? Attendance { get; init; }
        public DateOnly? Stampdate { get; init; }

    }

    public record ConsumerSessionInputModel
    {
        public IEnumerable<int> Consumers { get; init; }

    }

    public record SessionTimeInputModel
    {
        public string sessionTime { get; init; }
    }

    public record SessionAttendanceInputModel
    {
        public bool Attendance { get; init; }
    }

    public record SessionTestInputModel
    {
        public string id { get; init; }
    }

    public record SessionPageModel
    {
        public SessionOutputModel Session { get; init; }
        public IEnumerable<ConsumerSessionOutputModel> Consumers { get; init; }
        public IEnumerable<TestOutputModel> Tests { get; init; }
    }
}

using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public record TestOutputModel
    {
        public string ID { get; init; }
        public string Type { get; init; }
        public int ConsumersNumber { get; init; }
        public DateOnly RequestDate { get; init; }
        public DateOnly? ValidationDate { get; init; }
        public DateOnly? DueDate { get; init; }
        public DateOnly? ReportDeliveryDate { get; init; }
    }

    public record TestInputModel
    {
        public string ID { get; init; }
        public string TestType { get; init; }
        public int Product { get; init; }

        public string ClientID { get; init; }
        public int ConsumersNumber { get; init; }
        public DateOnly RequestDate { get; init; }
        public DateOnly? ValidationDate { get; init; }
        public DateOnly? DueDate { get; init; }
        public DateOnly? ReportDeliveryDate { get; init; }

        public IEnumerable<SampleInputModel> Samples { get; init; }

        public Test toDbTest()
        {
            return new Test
            {
                Internalid = ID,
                Product = Product,
                Clientid = ClientID,
                Testtype = TestType,
                Consumersnumber = ConsumersNumber,
                Requestdate = RequestDate,
                Validationdate = ValidationDate,
                Duedate = DueDate,
                Reportdeliverydate = ReportDeliveryDate,
            };
        }
    }
    public record TestPageModel{
        public IEnumerable<ConsumerOutputModel>? Consumers { get; init; }
        public SessionOutputModel? Session { get; init; }
        public TestOutputModel Test { get; init; }
    }
}

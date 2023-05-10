using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public class TestOutputModel
    {
        public string ID { get; set; }
        public string Type { get; set; }
        public int ConsumersNumber { get; set; }
        public DateOnly RequestDate { get; set; }
        public DateOnly? ValidationDate { get; set; }
        public DateOnly? DueDate { get; set; }
        public DateOnly? ReportDeliveryDate { get; set; }
    }

    public class TestInputModel
    {
        public string ID { get; set; }
        public int Product { get; set; }
        public string TestType { get; set; }
        public int ConsumersNumber { get; set; }
        public DateOnly RequestDate { get; set; }
        public DateOnly? ValidationDate { get; set; }
        public DateOnly? DueDate { get; set; }
        public DateOnly? ReportDeliveryDate { get; set; }

        public Test toDbTest()
        {
            return new Test
            {
                Internalid = ID,
                Product = Product,
                Testtype = TestType,
                Consumersnumber = ConsumersNumber,
                Requestdate = RequestDate,
                Validationdate = ValidationDate,
                Duedate = DueDate,
                Reportdeliverydate = ReportDeliveryDate,
            };
        }
    }
    public class TestPageModel{
        public List<ConsumerOutputModel> Consumers { get; set; }
        public SessionOutputModel? Session { get; set; }
        public TestOutputModel Test { get; set; }
    }
}

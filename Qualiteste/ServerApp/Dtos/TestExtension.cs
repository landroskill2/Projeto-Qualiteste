using Qualiteste.ServerApp.Dtos;

namespace Qualiteste.ServerApp.Models;

public partial class Test
{
    public TestOutputModel toOutputModel()
    {
        return new TestOutputModel
        {
            ID = Internalid,
            Type = Testtype,
            ConsumersNumber = Consumersnumber,
            RequestDate = Requestdate,
            ValidationDate = Validationdate,
            DueDate = Duedate,
            ReportDeliveryDate = Reportdeliverydate
        };
    }
}

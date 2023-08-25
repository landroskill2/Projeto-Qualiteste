using Qualiteste.ServerApp.Dtos;

namespace Qualiteste.ServerApp.Models;

public partial class Test
{
    public TestOutputModel toOutputModel(ProductOutputModel product)
    {
        return new TestOutputModel
        {
            ID = Internalid,
            Type = Testtype,
            ConsumersNumber = Consumersnumber,
            Product = product,
            RequestDate = Requestdate,
            ValidationDate = Validationdate,
            DueDate = Duedate,
            ReportDeliveryDate = Reportdeliverydate
        };
    }
}

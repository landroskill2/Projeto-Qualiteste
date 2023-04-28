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
}

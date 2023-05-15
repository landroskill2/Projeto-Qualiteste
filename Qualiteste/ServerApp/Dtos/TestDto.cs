﻿using Qualiteste.ServerApp.Models;

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
        public string ID { get; }
        public int Product { get; }
        public string TestType { get; }
        public int ConsumersNumber { get; }
        public DateOnly RequestDate { get; }
        public DateOnly? ValidationDate { get; }
        public DateOnly? DueDate { get; }
        public DateOnly? ReportDeliveryDate { get; }

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
    public record TestPageModel{
        public IEnumerable<ConsumerOutputModel> Consumers { get; init; }
        public SessionOutputModel? Session { get; init; }
        public TestOutputModel Test { get; init; }
    }
}

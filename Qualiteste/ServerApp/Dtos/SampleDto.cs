using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public record SampleInputModel
    {
        public int ProductId { get; init; }

        public int PresentationPosition { get; init; }

        public Sample toDbSample(string testId)
        {
            return new Sample
            {
                Testid = testId,
                Productid = ProductId,
                Presentationposition = PresentationPosition
            };
        }
    }

    public record SampleOutputModel
    {
        public int ProductId { get; init; }
        public string ProductRef { get; init; }
        public string ProductDesignation { get; init; }

        public int PresentationPosition { get; init; }

    }
}

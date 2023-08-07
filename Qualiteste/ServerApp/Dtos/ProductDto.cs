namespace Qualiteste.ServerApp.Dtos
{
    public record ProductOutputModel
    {
        public int Productid { get; init; }
        public string Designation { get; init; }
        public string Brand { get; init; }
    }

    public record BrandOutputModel
    {
        public IEnumerable<string> brands { get; init; }
    }
}

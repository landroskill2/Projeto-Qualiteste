using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public record FizzTableModel
    {
        public Dictionary<string, string> Columns { get; init; }
        public IEnumerable<Dictionary<string, string>> Rows { get; init; }

        public IEnumerable<SampleOutputModel> SamplesOrder { get; init; }

        public IEnumerable<FizzConsumerInfo>? ConsumersInfo { get; init; }
    }

    public record FizzAliasDto
    {
        public string Name { get; init; }
        public string Alias { get; init; }

        public FizzAttribute toDbAttribute(string Id)
        {
            return new FizzAttribute
            {
                Attribute = Name,
                Alias = Alias,
                Testid = Id,
            };
        }

    }

    public record FizzConsumerInfo
    {
        public int Id { get; init; }
        public string ConsumerName { get; init; }
        public int Presence{ get; init; }
    }
}

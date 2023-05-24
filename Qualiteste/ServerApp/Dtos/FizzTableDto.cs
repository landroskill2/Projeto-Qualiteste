namespace Qualiteste.ServerApp.Dtos
{
    public record FizzTableModel
    {
        public Dictionary<string, string> Columns { get; init; }
        public IEnumerable<Dictionary<string, string>> Rows { get; init; }
    }
}

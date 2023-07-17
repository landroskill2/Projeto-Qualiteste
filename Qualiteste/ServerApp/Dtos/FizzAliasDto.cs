using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
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



}

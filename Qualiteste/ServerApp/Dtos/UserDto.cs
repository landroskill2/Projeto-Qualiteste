namespace Qualiteste.ServerApp.Dtos
{
    public record UserDto
    {
        public string Username { get; init; }
        public string Password { get; init; }
        public string Type { get; init; }
        public string? ID { get; init; }
        public string? Name { get; init; }
    }
}

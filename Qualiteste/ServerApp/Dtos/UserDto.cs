namespace Qualiteste.ServerApp.Dtos
{
    public record UserDto
    {
        public string Username { get; init; }
        public string Password { get; init; }
        public string Role { get; init; }
        public string Id { get; init; }
        public string Designation { get; init; }
        
    }
}

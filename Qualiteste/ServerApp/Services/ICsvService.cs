namespace Qualiteste.ServerApp.Services
{
    public interface ICsvService
    {
        Task ParseCsv(IFormFile csvFile, string id);
    }
}

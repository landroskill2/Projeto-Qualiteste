using Qualiteste.ServerApp.Dtos;

namespace Qualiteste.ServerApp.Models;

public partial class Consumer
{
    public ConsumerOutputModel ToOutputModel()
    {
        return new ConsumerOutputModel
        {
            Id = Id,
            Fullname = Fullname,
            Age = (DateTime.Today.Year - Dateofbirth.Value.Year).ToString(),
            Sex = Sex,
            Contact = Contact,
            Email = Email,
        };
    }
}
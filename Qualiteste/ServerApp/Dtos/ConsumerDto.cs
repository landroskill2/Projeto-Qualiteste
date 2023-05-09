using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public class ConsumerOutputModel
    {
        public int Id { get; set; }
        public string Fullname { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public int Contact { get; set; }

        public string? Email { get; set; }
    }

    public class ConsumerInputModel
    {
        public int? Id { get; set; } = null;
        public string Fullname { get; set;}
        public string Nif { get; set; }
        public string Sex { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public int Contact { get; set; }
        public string? Email { get; set; } = null;

        public Consumer ToDbConsumer()
        {
           return new Consumer
            {
                Id = (int)Id,
                Fullname = Fullname,
                Nif = Nif,
                Sex = Sex,
                Dateofbirth = DateOfBirth,
                Contact = Contact,
                Email = Email
            };
        }
    }

    public class ConsumerPageModel
    {
        public ConsumerOutputModel Consumer { get; set; }
        public List<SessionOutputModel> Sessions { get; set; }
        public List<TestOutputModel> Tests { get; set; }
    }
}

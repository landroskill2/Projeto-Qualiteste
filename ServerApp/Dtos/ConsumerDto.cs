using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public class ConsumerOutputModel
    {
        public string Fullname { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public int Contact { get; set; }

        public string? Email { get; set; }
    }

    public class ConsumerInputModel
    {
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
                Fullname = Fullname,
                Nif = Nif,
                Sex = Sex,
                Dateofbirth = DateOfBirth,
                Contact = Contact,
                Email = Email
            };
        }
    }
}

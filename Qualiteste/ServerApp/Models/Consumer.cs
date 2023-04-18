using Qualiteste.ServerApp.Dtos;
using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class Consumer
{
    public int? Id { get; set; }

    public string Fullname { get; set; } = null!;

    public string Nif { get; set; } = null!;

    public string Sex { get; set; } = null!;

    public DateOnly? Dateofbirth { get; set; }

    public int Contact { get; set; }

    public string? Email { get; set; }

    public ConsumerOutputModel ToOutputModel() 
    {
        return new ConsumerOutputModel 
        {
            Fullname = Fullname,
            Age = (DateTime.Today.Year - Dateofbirth.Value.Year).ToString(),
            Sex = Sex,
            Contact = Contact,
            Email = Email,
        };
    }
}


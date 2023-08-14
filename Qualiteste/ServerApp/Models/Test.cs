using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class Test
{
    public string Internalid { get; set; } = null!;

    public string? Clientid { get; set; }

    public int? Product { get; set; }

    public string Testtype { get; set; } = null!;

    public int Consumersnumber { get; set; }

    public DateOnly Requestdate { get; set; }

    public DateOnly? Validationdate { get; set; }

    public DateOnly? Duedate { get; set; }

    public DateOnly? Reportdeliverydate { get; set; }

    public uint Version { get; set; }

    public string? Sessionid { get; set; }

    public virtual Client? Client { get; set; }

    public virtual ICollection<ConsumerHt> ConsumerHts { get; } = new List<ConsumerHt>();

    public virtual ICollection<FizzAttribute> FizzAttributes { get; } = new List<FizzAttribute>();

    public virtual Product? ProductNavigation { get; set; }

    public virtual ICollection<Sample> Samples { get; } = new List<Sample>();

    public virtual Session? Session { get; set; }
}

using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class Test
{
    public string Internalid { get; set; } = null!;

    public int Product { get; set; }

    public string Testtype { get; set; } = null!;

    public int Consumersnumber { get; set; }

    public DateOnly Requestdate { get; set; }

    public DateOnly? Validationdate { get; set; }

    public DateOnly? Duedate { get; set; }

    public DateOnly? Reportdeliverydate { get; set; }

    public virtual ICollection<ConsumerHt> ConsumerHts { get; } = new List<ConsumerHt>();

    public virtual ICollection<ConsumerSp> ConsumerSps { get; } = new List<ConsumerSp>();

    public virtual Product ProductNavigation { get; set; } = null!;

    public virtual ICollection<Sample> Samples { get; } = new List<Sample>();

    public virtual ICollection<Session> Sessions { get; } = new List<Session>();
}

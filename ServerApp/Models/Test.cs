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

    public virtual Product ProductNavigation { get; set; } = null!;
}

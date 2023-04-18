using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class Sample
{
    public string? Testid { get; set; }

    public int? Productid { get; set; }

    public DateOnly? Receptiondate { get; set; }

    public virtual Product? Product { get; set; }

    public virtual Test? Test { get; set; }
}

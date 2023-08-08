using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class Product
{
    public int Productid { get; set; }

    public string Ref { get; set; } = null!;

    public string? Designation { get; set; }

    public string? Brand { get; set; }

    public virtual ICollection<Sample> Samples { get; } = new List<Sample>();

    public virtual ICollection<Test> Tests { get; } = new List<Test>();
}

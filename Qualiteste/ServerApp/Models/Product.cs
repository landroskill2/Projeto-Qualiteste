using System;
using System.Collections.Generic;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Models;

public partial class Product
{
    public int Productid { get; set; }

    public string? Designation { get; set; }

    public string? Brand { get; set; }

    public virtual ICollection<Test> Tests { get; } = new List<Test>();
}

using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class FizzValue
{
    public int Id { get; set; }

    public string Columns { get; set; } = null!;

    public string Consumervalues { get; set; } = null!;

    public virtual ICollection<ConsumerSp> ConsumerSps { get; } = new List<ConsumerSp>();
}

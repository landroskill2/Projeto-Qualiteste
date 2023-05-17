using System;
using System.Collections.Generic;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Models;

public partial class ConsumerSp
{
    public string Testid { get; set; } = null!;

    public int Consumerid { get; set; }

    public int? Fizzid { get; set; }

    public virtual Consumer Consumer { get; set; } = null!;

    public virtual FizzValue? Fizz { get; set; }

    public virtual Test Test { get; set; } = null!;
}

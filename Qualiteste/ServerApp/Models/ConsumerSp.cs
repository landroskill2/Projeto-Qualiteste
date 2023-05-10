using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class ConsumerSp
{
    public string? Testid { get; set; }

    public int? Consumerid { get; set; }

    public virtual Consumer? Consumer { get; set; }

    public virtual Test? Test { get; set; }
}

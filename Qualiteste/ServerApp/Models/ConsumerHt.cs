using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class ConsumerHt
{
    public string Internalid { get; set; } = null!;

    public int Consumerid { get; set; }

    public DateOnly? Deliverydate { get; set; }

    public DateOnly? Duedate { get; set; }

    public DateOnly? Responsedate { get; set; }

    public DateOnly? Stampdate { get; set; }

    public virtual Consumer Consumer { get; set; } = null!;

    public virtual Test Internal { get; set; } = null!;
}

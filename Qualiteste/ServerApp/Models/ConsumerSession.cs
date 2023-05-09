using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class ConsumerSession
{
    public string Sessionid { get; set; } = null!;

    public int Consumerid { get; set; }

    public DateOnly? Contacteddate { get; set; }

    public DateOnly? Confirmationdate { get; set; }

    public TimeOnly? Sessiontime { get; set; }

    public bool? Attendance { get; set; }

    public DateOnly? Stampdate { get; set; }

    public virtual Consumer Consumer { get; set; } = null!;

    public virtual Session Session { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class Session
{
    public string Sessionid { get; set; } = null!;

    public DateOnly? Sessiondate { get; set; }

    public int Consumersnumber { get; set; }
}

using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class SessionTest
{
    public string? Sessionid { get; set; }

    public string? Testid { get; set; }

    public virtual Session? Session { get; set; }

    public virtual Test? Test { get; set; }
}

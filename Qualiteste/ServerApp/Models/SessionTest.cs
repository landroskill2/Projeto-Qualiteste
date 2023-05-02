using System;
using System.Collections.Generic;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Models;

public partial class SessionTest
{
    public string? Sessionid { get; set; }

    public string? Testid { get; set; }

    public virtual Session? Session { get; set; }

    public virtual Test? Test { get; set; }
}

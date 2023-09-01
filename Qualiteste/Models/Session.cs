using System;
using System.Collections.Generic;

namespace Qualiteste.Models;

public partial class Session
{
    public string Sessionid { get; set; } = null!;

    public DateOnly Sessiondate { get; set; }

    public int Consumersnumber { get; set; }

    public virtual ICollection<ConsumerSession> ConsumerSessions { get; } = new List<ConsumerSession>();

    public virtual ICollection<Test> Tests { get; } = new List<Test>();
}

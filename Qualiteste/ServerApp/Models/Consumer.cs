using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class Consumer
{
    public int Id { get; set; }

    public string Fullname { get; set; } = null!;

    public string? Nif { get; set; }

    public string Sex { get; set; } = null!;

    public DateOnly? Dateofbirth { get; set; }

    public int Contact { get; set; }

    public string? Email { get; set; }

    public virtual ICollection<ConsumerHt> ConsumerHts { get; } = new List<ConsumerHt>();

    public virtual ICollection<ConsumerSession> ConsumerSessions { get; } = new List<ConsumerSession>();
}

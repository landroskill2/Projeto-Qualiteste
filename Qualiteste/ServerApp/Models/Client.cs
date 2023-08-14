using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class Client
{
    public string Id { get; set; } = null!;

    public string Designation { get; set; } = null!;

    public string? Username { get; set; }

    public virtual ICollection<Test> Tests { get; } = new List<Test>();

    public virtual User? UsernameNavigation { get; set; }
}

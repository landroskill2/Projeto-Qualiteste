using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class User
{
    public string Username { get; set; } = null!;

    public string? Pwd { get; set; }

    public int? Role { get; set; }

    public virtual Role? RoleNavigation { get; set; }
}

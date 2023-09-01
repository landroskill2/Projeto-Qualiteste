using System;
using System.Collections.Generic;

namespace Qualiteste.Models;

public partial class User
{
    public string Username { get; set; } = null!;

    public string? Pwd { get; set; }

    public int? Role { get; set; }

    public string? Clientid { get; set; }

    public virtual Client? Client { get; set; }

    public virtual Role? RoleNavigation { get; set; }
}

using System;
using System.Collections.Generic;

namespace Qualiteste.Models;

public partial class Role
{
    public int Roleid { get; set; }

    public string? Roledesignation { get; set; }

    public virtual ICollection<User> Users { get; } = new List<User>();
}

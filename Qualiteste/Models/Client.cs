using System;
using System.Collections.Generic;

namespace Qualiteste.Models;

public partial class Client
{
    public string Id { get; set; } = null!;

    public string Designation { get; set; } = null!;

    public virtual ICollection<Test> Tests { get; } = new List<Test>();

    public virtual ICollection<User> Users { get; } = new List<User>();
}

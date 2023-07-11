﻿using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class FizzAttribute
{
    public string Testid { get; set; } = null!;

    public string Attribute { get; set; } = null!;

    public string? Alias { get; set; }

    public uint Version { get; set; }

    public virtual ICollection<AttributeValue> AttributeValues { get; } = new List<AttributeValue>();

    public virtual Test Test { get; set; } = null!;
}

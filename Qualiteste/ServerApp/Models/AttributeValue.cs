using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class AttributeValue
{
    public int Consumerid { get; set; }

    public string? Attrvalue { get; set; }

    public string Testid { get; set; } = null!;

    public string Attribute { get; set; } = null!;

    public virtual Consumer Consumer { get; set; } = null!;

    public virtual FizzAttribute FizzAttribute { get; set; } = null!;
}

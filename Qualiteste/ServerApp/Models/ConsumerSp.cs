﻿using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class ConsumerSp
{
    public string? Internalid { get; set; }

    public int? Consumerid { get; set; }

    public virtual Consumer? Consumer { get; set; }

    public virtual Test? Internal { get; set; }
}

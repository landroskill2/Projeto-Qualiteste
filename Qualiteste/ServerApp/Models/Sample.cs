﻿using System;
using System.Collections.Generic;

namespace Qualiteste.ServerApp.Models;

public partial class Sample
{
    public string Testid { get; set; } = null!;

    public int Productid { get; set; }

    public int Presentationposition { get; set; }

    public DateOnly? Receptiondate { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Test Test { get; set; } = null!;
}

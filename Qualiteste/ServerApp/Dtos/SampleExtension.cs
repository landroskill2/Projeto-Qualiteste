using Qualiteste.ServerApp.Dtos;

namespace Qualiteste.ServerApp.Models;
public partial class Sample
{
    public SampleOutputModel toOutputModel()
    {
        return new SampleOutputModel
        {
            Product = Product.toOutputModel(),
            PresentationPosition = Presentationposition
        };
    }
}
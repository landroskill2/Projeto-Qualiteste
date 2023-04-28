using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class TestService : ITestService
    {
        private readonly IUnitOfWork _unitOfWork;
        public TestService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Either<CustomError, IEnumerable<TestOutputModel>> GetTestsList()
        {
            try
            {
               return _unitOfWork.Tests.ListTestsByDate().Select(t => t.toOutputModel()).ToList();
            }catch (Exception ex)
            {
                return null;
            }
        }
    }
}

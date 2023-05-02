using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
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

        public Either<CustomError, TestOutputModel> GetTestById(string id)
        {
            try
            {
                return _unitOfWork.Tests.GetTestById(id).toOutputModel();
            }catch(Exception ex)
            {
                return null;
            }
        }

        public Either<CustomError, string> CreateNewTest(TestInputModel testInput)
        {
            try
            {
                Test dbTest = testInput.toDbTest();
                _unitOfWork.Tests.Add(dbTest);
                return dbTest.Internalid;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public Either<CustomError, TestOutputModel> UpdateTest(int id, TestInputModel testInput)
        {
            try
            {
                Test dbTest = testInput.toDbTest();
                _unitOfWork.Tests.Update(dbTest);
                return dbTest.toOutputModel();

            }catch(Exception ex)
            {
                return null;
            }
        }
    }
}

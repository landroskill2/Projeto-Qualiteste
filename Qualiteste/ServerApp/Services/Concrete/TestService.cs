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
           
            return _unitOfWork.Tests.ListTestsByDate().Select(t => t.toOutputModel()).ToList();
 
        }

        public Either<CustomError, IEnumerable<TestOutputModel>> GetFilteredTestsList(string type)
        {
            try
            {
                return _unitOfWork.Tests.ListTestsWithFilters(type).Select(t => t.toOutputModel()).ToList();
            }catch(Exception e)
            {
                return null;
            }
        }

        public Either<CustomError, TestPageModel> GetTestById(string id)
        {
            Test? test = _unitOfWork.Tests.GetTestById(id);
            if (test == null) return new NoTestFoundWithGivenID();
            TestPageModel pageModel = new TestPageModel();
            
            pageModel.Test = test.toOutputModel();
            if (test.Testtype.Equals("SP")) pageModel.Session = test.Sessions.First().toOutputModel();
            pageModel.Consumers = _unitOfWork.Tests.GetConsumersInTest(id).Select(c => c.ToOutputModel()).ToList();

            return pageModel;
        }

        public Either<CustomError, string> CreateNewTest(TestInputModel testInput)
        {
            try
            {
                Test dbTest = testInput.toDbTest();
                _unitOfWork.Tests.Add(dbTest);
                _unitOfWork.Complete();
                return dbTest.Internalid;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                _unitOfWork.UntrackChanges();
                var dbException = ex.InnerException as Npgsql.NpgsqlException;
                if (dbException != null)
                {
                    var state = dbException.Data["SqlState"];
                    var constraint = dbException.Data["ConstraintName"];
                    if (state.Equals("22001"))
                        return new TestFieldIsToLong();
                    else if (state.Equals("23514") && constraint.Equals("test_testtype_check"))
                        return new InvalidTestType();
                    else if (state.Equals("23505") && constraint.Equals("test_pkey"))
                        return new TestWithSameIdAlreadyPresent();
                    else if (state.Equals("23503") && constraint.Equals("test_product_fkey"))
                        return new TestReferencesNonExistingProduct();
                }
                throw ex;
            }
        }


        /*
         * TODO: Falar com a qualiteste para ver que campos eles entendem que podem ser alterados depois da criação
         * 
         * Test.ReportDeliveryDate pode ser alterado
         * 
         * **/
        public Either<CustomError, TestOutputModel> UpdateTest(int id, TestInputModel testInput)
        {
            try
            {
                Test dbTest = testInput.toDbTest();
                _unitOfWork.Tests.Update(dbTest);
                _unitOfWork.Complete();
                return dbTest.toOutputModel();

            }catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                return null;
            }
        }
    }
}

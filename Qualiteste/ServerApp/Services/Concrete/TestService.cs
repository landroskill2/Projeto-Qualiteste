﻿using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Replies;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using Qualiteste.ServerApp.Utils;
using System.Collections.Immutable;
using System.Diagnostics;
using static System.Net.Mime.MediaTypeNames;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class TestService : ITestService
    {
        private readonly IUnitOfWork _unitOfWork;
        public TestService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

       

        public Either<CustomError,IEnumerable<TestOutputModel>> GetTestsList()
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
                throw e;
            }
        }

        public Either<CustomError, TestPageModel> GetTestById(string id)
        {
            SessionOutputModel? session = null;
            Test? test = _unitOfWork.Tests.GetTestById(id);
            if (test == null) return new TestErrors.NoTestFoundWithGivenID();

            if (test.Testtype.Equals("SP")) session = test.Session?.toOutputModel();
            IEnumerable<ConsumerOutputModel>? consumers = _unitOfWork.Tests.GetConsumersInTest(id)?.Select(c => c.ToOutputModel());

            return new TestPageModel
            {
                Test = test.toOutputModel(),
                Session = session,
                Consumers = consumers
            };
        }

        public Either<CustomError, string> CreateNewTest(TestInputModel testInput)
        {
            try
            {
                if (testInput.Samples.ToArray().Length == 0) return new TestErrors.TestHasNoSamples();
                Test dbTest = testInput.toDbTest();
                IEnumerable<Sample> samples = testInput.Samples.Select(c => c.toDbSample(testInput.ID));
                foreach (Sample sample in samples)
                {
                    dbTest.Samples.Add(sample);
                }
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
                        return new TestErrors.TestFieldIsToLong();
                    else if (state.Equals("23514") && constraint.Equals("test_testtype_check"))
                        return new TestErrors.InvalidTestType();
                    else if (state.Equals("23505") && constraint.Equals("test_pkey"))
                        return new TestErrors.TestWithSameIdAlreadyPresent();
                    else if (state.Equals("23503") && constraint.Equals("test_product_fkey"))
                        return new TestErrors.TestReferencesNonExistingProduct();
                    else if (state.Equals("23505") && constraint.Equals("unq_presentationposition"))
                        return new TestErrors.SamplePresentationPositionOverlapping();
                    else if (state.Equals("23503") && constraint.Equals("sample_productid_fkey"))
                        return new TestErrors.SampleRefersNonExistingProduct();
                }
                throw ex;
            }
        }
        /**
         * bulk update attributes on test
         */
        public Either<CustomError, TestSucesses> UpdateAttributeAlias(string testId, FizzAliasDto[] alias)
        {
            try
            {
                
                IEnumerable<FizzAttribute> attrsToUpdate = _unitOfWork.Tests.GetAttributesInTest(testId)
                                                                .Where(attr => alias.Any(a => a.Name == attr.Attribute));
                foreach(var v in alias)
                {
                    attrsToUpdate.Single(attr => attr.Attribute == v.Name).Alias = v.Alias;
                }
                _unitOfWork.Complete();
                //return updated attributes
                return new TestSucesses.UpdateAttributeAliasSuccess();
            }
            catch (Exception e)
            {
                _unitOfWork.UntrackChanges();
                throw e;
            }
            
        }

        /*
         * TODO: Falar com a qualiteste para ver que campos eles entendem que podem ser alterados depois da criação
         * 
         * Test.ReportDeliveryDate pode ser alterado
         * 
         * **/
        public Either<CustomError, TestOutputModel> UpdateTest(string id, TestInputModel testInput)
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
                throw ex;
            }
        }

        public Either<CustomError, TestSucesses> AddConsumerToTest(string id, IEnumerable<int> consumer)
        {
            try
            {
                _unitOfWork.Tests.AddConsumerToTest(id, consumer);
                _unitOfWork.Complete();
                return new TestSucesses.AddConsumerToTestSuccess();
            }catch(InvalidOperationException ex){
                return new TestErrors.ConsumerAlreadyInTest();
            }catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                throw ex;
            }
        }

        public Either<CustomError, FizzTableModel> GetFizzTable(string id)
        {
            try
            {
                Test test = _unitOfWork.Tests.GetTestById(id);
                if (test == null) return new TestErrors.NoTestFoundWithGivenID();

                Dictionary<string, string> columns = _unitOfWork.Tests.GetFizzColumns(id);
                var values = _unitOfWork.Tests.GetFizzValuesGroupedByConsumer(id);

                //Get consumer name
                var cIds = values.Select(v => v.Key).ToList();
                var consumersInfo = GetInfoOnConsumers(cIds, test);
                IEnumerable<Dictionary<string, string>> rows = values.Select(v => v.ToDictionary(attr => attr.Attribute, attr => attr.Attrvalue));

                IEnumerable<SampleOutputModel> samplesInTest = test.Samples.Select(s => new SampleOutputModel
                {
                    PresentationPosition = s.Presentationposition,
                    ProductRef = s.Product.Ref,
                    ProductDesignation = s.Product.Designation,
                    ProductId = s.Productid
                }).OrderBy(s => s.PresentationPosition);

                FizzTableModel fizzTable = new FizzTableModel
                {
                    Columns = columns,
                    Rows = rows,
                    SamplesOrder = samplesInTest,
                    ConsumersInfo = consumersInfo
                };

                return fizzTable;

            }catch(Exception ex)
            {
                _unitOfWork.UntrackChanges();
                throw ex;
            }
        }

        public Either<CustomError, IEnumerable<TestOutputModel>> GetClientsTests(string clientUsername)
        {
            try
            {
                string clientID = _unitOfWork.Clients.GetClientIDByUsername(clientUsername);
                return _unitOfWork.Tests.GetTestsByClient(clientID).Select(x => x.toOutputModel()).ToList();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public Either<CustomError, TestPageModel> GetClientsTestByID(string clientUsername, string id)
        {
             try
            {
                string clientID = _unitOfWork.Clients.GetClientIDByUsername(clientUsername);
                Test? test = _unitOfWork.Tests.GetClientTestsByID(clientID, id);
                if (test == null) return new TestErrors.NoTestFoundWithGivenID();

                return new TestPageModel {
                    Test = test.toOutputModel()
                };
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }


        /**
         * Presence:
         *  - 0 -> is in FizzTable and Test Session
         *  - 1 -> is in FizzTable but not Test Session
         *  - 2 -> is not on FizzTable but is on Test Session
         */
        private IEnumerable<FizzConsumerInfo> GetInfoOnConsumers(List<int> cIds, Test test) {
            var consumersSession = test.Session.ConsumerSessions;
            List<FizzConsumerInfo> result = new List<FizzConsumerInfo>();
            foreach (var cId in cIds) {
                if (consumersSession.Any(cs => cs.Consumerid == cId))
                {
                    var info = new FizzConsumerInfo
                    {
                        Id = cId,
                        ConsumerName = consumersSession.Single(cs => cs.Consumerid == cId).Consumer.Fullname,
                        Presence = 0
                    };
                    result.Add(info);
                    
                }
                else
                {
                    var info = new FizzConsumerInfo
                    {
                        Id = cId,
                        ConsumerName = consumersSession.Single(cs => cs.Consumerid == cId).Consumer.Fullname,
                        Presence = 1
                    };
                    result.Add(info);
                }
            }
            var notInFizzTable = consumersSession.Select(cs => cs.Consumerid).Except(cIds).ToList();
            notInFizzTable.ForEach(id =>
                result.Add(new FizzConsumerInfo
                {
                    Id = id,
                    ConsumerName = _unitOfWork.Consumers.GetConsumerById(id).Fullname,
                    Presence = 2
                })
            );
            return result;
        }
    }
}

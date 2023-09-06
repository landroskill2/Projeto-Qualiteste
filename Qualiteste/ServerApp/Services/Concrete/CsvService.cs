using Qualiteste.ServerApp.DataAccess;
using CsvHelper;
using System.Globalization;
using Qualiteste.ServerApp.Models;
using Microsoft.AspNetCore.Server.Kestrel.Core.Features;
using Qualiteste.ServerApp.Utils;
using Qualiteste.ServerApp.Services.Replies.Errors;
using Qualiteste.ServerApp.Services.Replies.Successes;
using static System.Net.Mime.MediaTypeNames;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class CsvService : ICsvService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CsvService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Either<CustomError, TestSuccesses>> ParseCsv(IFormFile csvFile, string id)
        {
            try{
                Test test = _unitOfWork.Tests.GetTestById(id);
                if (test == null) return new TestErrors.NoTestFoundWithGivenID();
                if (test.Session == null) return new TestErrors.TestMustBeAssociatedWithSession();
                using (var reader = new StreamReader(csvFile.OpenReadStream()))
                {
                    using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
                    await csv.ReadAsync();
                    csv.ReadHeader();
                    string[] headers = csv.HeaderRecord;
                    if (headers.Length < 0) return new FizzParserErrors.InvalidFizzResultFormat();
                    int consumerIndex = Array.IndexOf(headers, "CJ");
                    
                    insertHeadersInDb(headers, id);
                    while(csv.Parser.ReadAsync().Result)
                    {
                        string[] row = csv.Parser.Record;
                        insertValuesInDb(headers, row, id, consumerIndex);
                    }
                    _unitOfWork.Complete();
                }
                return new TestSuccesses.FileUploadSuccess();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                _unitOfWork.UntrackChanges();
                var dbException = ex.InnerException as Npgsql.NpgsqlException;
                if (dbException != null)
                {
                    var state = dbException.Data["SqlState"];
                    var constraint = dbException.Data["ConstraintName"];
                    if (state.Equals("23503") && constraint.Equals("attribute_values_consumerid_fkey"))
                        return new TestErrors.TestResultsReferencesNonExistingConsumer();
                }
                throw ex;
            }

        }

        private void insertValuesInDb(string[] headers, string[] row, string id, int consumerIndex)
        {
            if (row.All(value => value == "")) return;

            string strID = id.ToString();
            int consumerID;
            if(!int.TryParse(row[consumerIndex], out consumerID)) return;

            for(int i = 0; i < headers.Length; i++)
            {
                AttributeValue attributeValue = new AttributeValue
                {
                    Consumerid = consumerID,
                    Testid = strID,
                    Attribute = headers[i],
                    Attrvalue = row[i]
                };

                _unitOfWork.Tests.AddAttributeValue(attributeValue);
            }

        }

        private void insertHeadersInDb(string[] headers, string id)
        {
            string strID = id.ToString();
            foreach (var header in headers)
            {
                FizzAttribute attr = new FizzAttribute
                {
                    Testid = strID,
                    Attribute = header
                };

                _unitOfWork.Tests.AddFizzAttribute(attr);
            }
        }
    }
}

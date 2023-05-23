﻿using Qualiteste.ServerApp.DataAccess;
using CsvHelper;
using System.Globalization;
using Qualiteste.ServerApp.Models;
using Microsoft.AspNetCore.Server.Kestrel.Core.Features;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class CsvService : ICsvService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CsvService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task ParseCsv(IFormFile csvFile, int id)
        {
            using (var reader = new StreamReader(csvFile.OpenReadStream()))
            {
                using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

                await csv.ReadAsync();
                csv.ReadHeader();
                string[] headers = csv.HeaderRecord;
                int consumerIndex = Array.IndexOf(headers, "CJ");
                
                insertHeadersInDb(headers, id);
                while(csv.Parser.ReadAsync().Result)
                {
                    string[] row = csv.Parser.Record;
                    insertValuesInDb(headers, row, id, consumerIndex);
                }
                _unitOfWork.Complete(); // nunca chega ao complete, dont know why
            }
        }

        private void insertValuesInDb(string[] headers, string[] row, int id, int consumerIndex)
        {
            string strID = id.ToString();
            int consumerID;
            int.TryParse(row[consumerIndex], out consumerID);

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

        private void insertHeadersInDb(string[] headers, int id)
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

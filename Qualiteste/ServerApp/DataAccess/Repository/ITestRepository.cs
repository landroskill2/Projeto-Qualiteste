﻿using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.DataAccess.Repository
{
    public interface ITestRepository : IRepository<Test>
    {
        IEnumerable<Consumer>? GetConsumersInTest(string id);
        Test? GetTestById(string id);
        IEnumerable<Test> ListTestsByDate();
        IEnumerable<Test> ListTestsWithFilters(string type);
        void AddFizzAttribute(FizzAttribute fizzAttribute);

        void AddAliasToFizzAttribute(string testId, string attributeName, string updatedAlias);
        void AddAttributeValue(AttributeValue attributeValue);
        Dictionary<string, string> GetFizzColumns(int id);
        IEnumerable<IGrouping<int, AttributeValue>> GetFizzValuesGroupedByConsumer(int id);
        void AddConsumerToTest(string id, int consumer);
    }
}

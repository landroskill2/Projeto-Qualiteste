using Qualiteste.ServerApp.DataAccess.Repository;

namespace Qualiteste.ServerApp.DataAccess
{
    public interface IUnitOfWork : IDisposable
    {
        IConsumerRepository Consumers { get; }
        ITestRepository Tests { get; }
        ISessionRepository Sessions { get; }
        IUserRepository Users { get; }
        int Complete();
        void UntrackChanges();
    }
}

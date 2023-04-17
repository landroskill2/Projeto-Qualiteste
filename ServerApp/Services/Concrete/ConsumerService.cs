using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Errors;

namespace Qualiteste.ServerApp.Services.Concrete
{
    public class ConsumerService : IConsumerService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ConsumerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public int CreateNewConsumer(ConsumerInputModel consumer)
        {
            try {
                Consumer dbConsumer = consumer.ToDbConsumer();
                _unitOfWork.Consumers.Add(dbConsumer);
                _unitOfWork.Complete();
                return (int)dbConsumer.Id;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                var dbException = ex.InnerException as Npgsql.NpgsqlException;
                if (dbException != null)
                {
                    var state = dbException.Data["SqlState"];
                    var constraint = dbException.Data["ConstraintName"];
                    if (state.Equals("23505") && constraint.Equals("consumer_pkey")) 
                        throw new ConsumerWithIdAlreadyPresent();
                    if (state.Equals("23505") && constraint.Equals("consumer_contact_key"))
                        throw new ConsumerWithContactAlreadyPresent();
                    //dbException
                }
                //ex.InnerException
                //if(dbException.)
                throw ex;
            }
        }

        public ConsumerOutputModel GetConsumerById(int id)
        {
            Consumer? consumer = _unitOfWork.Consumers.GetConsumerById(id);
            if (consumer == null) throw new NoConsumerFoundWithId();
            return consumer.ToOutputModel();
        }

        public IEnumerable<ConsumerOutputModel> GetConsumersAlphabetically()
        {
            try {
                return _unitOfWork.Consumers.GetConsumersAlphabetically().Select(c => c.ToOutputModel());
            }catch (Exception ex) {
                throw ex;
            }
            
        }

        public IEnumerable<ConsumerOutputModel> GetConsumersFiltered(string sex)
        {
            throw new NotImplementedException();
        }
    }
}

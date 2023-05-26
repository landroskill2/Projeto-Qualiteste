using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Services.Concrete
{
    
    public class ConsumerService : IConsumerService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ConsumerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Either<CustomError, int> CreateNewConsumer(ConsumerInputModel consumer)
        {
            try {
                Consumer dbConsumer;
                if(consumer.Id == null)
                {
                    int id = (_unitOfWork.Consumers.GetLastID() + 1);
                    dbConsumer = consumer.ToDbConsumer(id);
                }
                else
                {
                    dbConsumer = consumer.ToDbConsumer();
                }
                _unitOfWork.Consumers.Add(dbConsumer);
                _unitOfWork.Complete();
                return dbConsumer.Id;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                _unitOfWork.UntrackChanges();
                var dbException = ex.InnerException as Npgsql.NpgsqlException;
                if (dbException != null)
                {
                    var state = dbException.Data["SqlState"];
                    var constraint = dbException.Data["ConstraintName"];
                    if (state.Equals("23505") && constraint.Equals("consumer_pkey")) 
                        return new ConsumerWithIdAlreadyPresent();
                    else if (state.Equals("23505") && constraint.Equals("consumer_contact_key"))
                        return new ConsumerWithContactAlreadyPresent();
                    else if (state.Equals("23505") && constraint.Equals("consumer_nif_key"))
                        return new ConsumerWithNifAlreadyPresent();
                }
                throw ex;
            }     
        }

        public Either<CustomError, ConsumerOutputModel> DeleteConsumer(int id)
        {
            Consumer? c = _unitOfWork.Consumers.GetConsumerById(id);
            if (c != null)
            {
                _unitOfWork.Consumers.Remove(c);
                return c.ToOutputModel();
            }
            else return new NoConsumerFoundWithId();
        }

        public Either<CustomError, ConsumerPageModel> GetConsumerById(int id)
        {
            Consumer consumer = _unitOfWork.Consumers.GetConsumerById(id);

            if (consumer == null) return new NoConsumerFoundWithId();

            IEnumerable<SessionOutputModel> sessions = consumer.ConsumerSessions.Select(cs => cs.Session.toOutputModel());
            IEnumerable<TestOutputModel> tests = consumer.ConsumerHts.Select(cht => cht.Test.toOutputModel());

            return new ConsumerPageModel
            {
                Consumer = consumer.ToOutputModel(),
                Sessions = sessions,
                Tests = tests
            };
        }

        public Either<CustomError, IEnumerable<ConsumerOutputModel>> GetConsumersAlphabetically()
        {
            try {
                List<ConsumerOutputModel> result = _unitOfWork.Consumers.GetConsumersAlphabetically()
                    .Select(c => c.ToOutputModel())
                    .ToList();
                return result;
            }catch (Exception ex) {
                throw ex;
            }
            
        }

        public Either<CustomError, IEnumerable<ConsumerOutputModel>> GetConsumersFiltered(string sex, string age, string name)
        {
            try
            {
                int iage;
                int.TryParse(age, out iage);
                if (iage < 0) return new ConsumerFilterNotValid();
                if (!(sex == null|| sex.ToUpper().Equals("M") || sex.ToUpper().Equals("F"))) return new ConsumerFilterNotValid();

                //Might be a problem, there are consumers with no specified dateOfBirth
                IEnumerable<ConsumerOutputModel> consumers = _unitOfWork.Consumers.GetConsumersFiltered(sex, iage, name)
                        .Select(c => c.ToOutputModel());
                return consumers.ToList();
            }
            catch(FormatException ex){
                return new ConsumerFilterNotValid();
            }
            catch(Exception ex)
            {
                throw ex;
            }

        }


        public Either<CustomError, ConsumerOutputModel> UpdateConsumer(int id, ConsumerInputModel consumer)
        {

            try {
                Consumer c = _unitOfWork.Consumers.GetConsumerById(id);
                c.Fullname = consumer.Fullname;
                c.Dateofbirth = consumer.DateOfBirth;
                c.Nif = consumer.Nif;
                c.Email = consumer.Email;
                c.Contact = consumer.Contact;
                c.Sex = consumer.Sex;
                _unitOfWork.Consumers.Update(c);
                _unitOfWork.Complete();
                return c.ToOutputModel();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                _unitOfWork.UntrackChanges();
                var dbException = ex.InnerException as Npgsql.NpgsqlException;
                if (dbException != null)
                {
                    var state = dbException.Data["SqlState"];
                    var constraint = dbException.Data["ConstraintName"];
                    if (state.Equals("23505") && constraint.Equals("consumer_contact_key"))
                        return new ConsumerWithContactAlreadyPresent();
                    else if (state.Equals("23505") && constraint.Equals("consumer_nif_key"))
                        return new ConsumerWithNifAlreadyPresent();
                }
                throw ex;
            }
        }
    }
}

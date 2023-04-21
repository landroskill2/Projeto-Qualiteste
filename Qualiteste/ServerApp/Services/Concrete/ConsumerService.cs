﻿using Qualiteste.ServerApp.DataAccess;
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
                if(consumer.Id == null)
                {
                    consumer.Id = _unitOfWork.Consumers.GetLastID() + 1;
                }
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
                        return new ConsumerWithIdAlreadyPresent();
                    if (state.Equals("23505") && constraint.Equals("consumer_contact_key"))
                        return new ConsumerWithContactAlreadyPresent(); 
                }
                throw ex;
            }
        }

        public Either<CustomError, ConsumerOutputModel> GetConsumerById(int id)
        {
            Consumer? consumer = _unitOfWork.Consumers.GetConsumerById(id);
            return consumer == null ? new NoConsumerFoundWithId() : consumer.ToOutputModel();
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
            sex = sex != null ? sex.ToUpper() : "*";
            age ??= "0";
            name = name != null ? name.ToUpper() : "*";
            //Might be a problem, there are consumers with no specified dateOfBirth
            //Handle parse in case of exception
            try
            {
                if (sex.Equals("*") || sex.Equals("M") || sex.Equals("F")) {
                    int iage = int.Parse(age);
                    IEnumerable<ConsumerOutputModel> consumers = _unitOfWork.Consumers.GetConsumersFiltered(sex, iage, name)
                        .Select(c => c.ToOutputModel());
                    return consumers.ToList();
                }else return new ConsumerFilterNotValid();
            }
            catch(FormatException ex){
                return new ConsumerFilterNotValid();
            }
            catch(ArgumentNullException ex)
            {
                return new ConsumerFilterNotValid();
            }
            catch(Exception ex)
            {
                throw ex;
            }
           
            
            
            
        }

        //Throwing exception on Complete.
        //Might be because id is defined as generated always as Identity on Consumer create table script
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
            catch(Exception e)
            {
                throw e;
            }
        }
    }
}

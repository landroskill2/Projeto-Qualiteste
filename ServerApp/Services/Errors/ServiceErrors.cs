﻿namespace Qualiteste.ServerApp.Services.Errors
{
    public class NoConsumerFoundWithId : CustomError
    {
        public NoConsumerFoundWithId() : base("Não foi possivel encontrar um consumidor com o id especificado", 404)
        {

        }
    }

    public class ConsumerWithIdAlreadyPresent : CustomError
    {
         public ConsumerWithIdAlreadyPresent() : base("Não foi possivel criar um consumidor, id já se encontra em uso", 400)
         {
        
         }
    }
    public class ConsumerWithContactAlreadyPresent : CustomError
    {
        public ConsumerWithContactAlreadyPresent() : base("Não foi possivel criar um consumidor, contacto já se encontra em uso", 400)
        {

        }
    }
}

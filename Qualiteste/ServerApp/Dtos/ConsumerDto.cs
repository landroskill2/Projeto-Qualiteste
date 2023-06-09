﻿using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Models;

namespace Qualiteste.ServerApp.Dtos
{
    public record ConsumerOutputModel
    {
        public int Id { get; init; }
        public string Fullname { get; init; }
        public string Age { get; init; }
        public string Sex { get; init; }
        public int Contact { get; init; }

        public string? Email { get; init; }
    }

    public record ConsumerInputModel
    {
        public int? Id { get; init; } = null;
        public string Fullname { get; init; }
        public string Nif { get; init; }
        public string Sex { get; init; }
        public DateOnly DateOfBirth { get; init; }
        public int Contact { get; init; }
        public string? Email { get; init; } = null;

        public Consumer ToDbConsumer()
        {
           return new Consumer
            {
                Id = (int)Id,
                Fullname = Fullname,
                Nif = Nif,
                Sex = Sex,
                Dateofbirth = DateOfBirth,
                Contact = Contact,
                Email = Email
            };
        }

        public Consumer ToDbConsumer(int id)
        {
            return new Consumer
            {
                Id = id,
                Fullname = Fullname,
                Nif = Nif,
                Sex = Sex,
                Dateofbirth = DateOfBirth,
                Contact = Contact,
                Email = Email
            };
        }
    }

    public record ConsumerPageModel
    {
        public ConsumerOutputModel Consumer { get; init; }
        public IEnumerable<SessionOutputModel> Sessions { get; init; }
        public IEnumerable<TestOutputModel> Tests { get; init; }
    }
}

using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Qualiteste.ServerApp.Models;

public partial class PostgresContext : DbContext
{
    private readonly IConfiguration _configuration;
    private readonly bool _useTestDB;

    public PostgresContext(IConfiguration config, bool useTestDB = false)
    {
        _configuration = config;
        _useTestDB = useTestDB;
    }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<Consumer> Consumers { get; set; }

    public virtual DbSet<ConsumerHt> ConsumerHts { get; set; }

    public virtual DbSet<ConsumerSession> ConsumerSessions { get; set; }

    public virtual DbSet<ConsumerSp> ConsumerSps { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Sample> Samples { get; set; }

    public virtual DbSet<Session> Sessions { get; set; }

    public virtual DbSet<Test> Tests { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            if(_useTestDB)
            {
                optionsBuilder.UseLazyLoadingProxies(true).UseNpgsql(_configuration.GetConnectionString("testDB"));
            }
            else
            {
                optionsBuilder.UseLazyLoadingProxies(true).UseNpgsql(_configuration.GetConnectionString("postgresDB"));
            }
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("pg_catalog", "adminpack");

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Acronym).HasName("client_pkey");

            entity.ToTable("client");

            entity.Property(e => e.Acronym)
                .HasMaxLength(10)
                .HasColumnName("acronym");
            entity.Property(e => e.Companyname)
                .HasMaxLength(50)
                .HasColumnName("companyname");
        });

        modelBuilder.Entity<Consumer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("consumer_pkey");

            entity.ToTable("consumer");

            entity.HasIndex(e => e.Contact, "consumer_contact_key").IsUnique();

            entity.HasIndex(e => e.Nif, "consumer_nif_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Contact).HasColumnName("contact");
            entity.Property(e => e.Dateofbirth).HasColumnName("dateofbirth");
            entity.Property(e => e.Email)
                .HasColumnType("character varying")
                .HasColumnName("email");
            entity.Property(e => e.Fullname)
                .HasMaxLength(200)
                .HasColumnName("fullname");
            entity.Property(e => e.Nif)
                .HasMaxLength(15)
                .HasColumnName("nif");
            entity.Property(e => e.Sex)
                .HasMaxLength(1)
                .HasColumnName("sex");
        });

        modelBuilder.Entity<ConsumerHt>(entity =>
        {
            entity.HasKey(e => new { e.Consumerid, e.Internalid }).HasName("consumer_ht_pkey");

            entity.ToTable("consumer_ht");

            entity.Property(e => e.Consumerid).HasColumnName("consumerid");
            entity.Property(e => e.Internalid)
                .HasMaxLength(20)
                .HasColumnName("internalid");
            entity.Property(e => e.Deliverydate).HasColumnName("deliverydate");
            entity.Property(e => e.Duedate).HasColumnName("duedate");
            entity.Property(e => e.Responsedate).HasColumnName("responsedate");
            entity.Property(e => e.Stampdate).HasColumnName("stampdate");

            entity.HasOne(d => d.Consumer).WithMany(p => p.ConsumerHts)
                .HasForeignKey(d => d.Consumerid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("consumer_ht_consumerid_fkey");

            entity.HasOne(d => d.Internal).WithMany(p => p.ConsumerHts)
                .HasForeignKey(d => d.Internalid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("consumer_ht_internalid_fkey");
        });

        modelBuilder.Entity<ConsumerSession>(entity =>
        {
            entity.HasKey(e => new { e.Consumerid, e.Sessionid }).HasName("consumer_session_pkey");

            entity.ToTable("consumer_session");

            entity.Property(e => e.Consumerid).HasColumnName("consumerid");
            entity.Property(e => e.Sessionid)
                .HasMaxLength(8)
                .HasColumnName("sessionid");
            entity.Property(e => e.Attendance).HasColumnName("attendance");
            entity.Property(e => e.Confirmationdate).HasColumnName("confirmationdate");
            entity.Property(e => e.Contacteddate).HasColumnName("contacteddate");
            entity.Property(e => e.Sessiontime).HasColumnName("sessiontime");
            entity.Property(e => e.Stampdate).HasColumnName("stampdate");

            entity.HasOne(d => d.Consumer).WithMany(p => p.ConsumerSessions)
                .HasForeignKey(d => d.Consumerid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("consumer_session_consumerid_fkey");

            entity.HasOne(d => d.Session).WithMany(p => p.ConsumerSessions)
                .HasForeignKey(d => d.Sessionid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("consumer_session_sessionid_fkey");
        });

        modelBuilder.Entity<ConsumerSp>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("consumer_sp");

            entity.Property(e => e.Consumerid).HasColumnName("consumerid");
            entity.Property(e => e.Internalid)
                .HasMaxLength(20)
                .HasColumnName("internalid");

            entity.HasOne(d => d.Consumer).WithMany()
                .HasForeignKey(d => d.Consumerid)
                .HasConstraintName("consumer_sp_consumerid_fkey");

            entity.HasOne(d => d.Internal).WithMany()
                .HasForeignKey(d => d.Internalid)
                .HasConstraintName("consumer_sp_internalid_fkey");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Productid).HasName("product_pkey");

            entity.ToTable("product");

            entity.Property(e => e.Productid)
                .ValueGeneratedNever()
                .HasColumnName("productid");
            entity.Property(e => e.Brand)
                .HasMaxLength(50)
                .HasColumnName("brand");
            entity.Property(e => e.Designation)
                .HasMaxLength(200)
                .HasColumnName("designation");
        });

        modelBuilder.Entity<Sample>(entity =>
        {
            entity.HasKey(e => new { e.Testid, e.Productid }).HasName("sample_pkey");

            entity.ToTable("sample");

            entity.Property(e => e.Testid)
                .HasMaxLength(20)
                .HasColumnName("testid");
            entity.Property(e => e.Productid).HasColumnName("productid");
            entity.Property(e => e.Receptiondate).HasColumnName("receptiondate");

            entity.HasOne(d => d.Product).WithMany(p => p.Samples)
                .HasForeignKey(d => d.Productid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sample_productid_fkey");

            entity.HasOne(d => d.Test).WithMany(p => p.Samples)
                .HasForeignKey(d => d.Testid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sample_testid_fkey");
        });

        modelBuilder.Entity<Session>(entity =>
        {
            entity.HasKey(e => e.Sessionid).HasName("session_pkey");

            entity.ToTable("session");

            entity.Property(e => e.Sessionid)
                .HasMaxLength(32)
                .HasColumnName("sessionid");
            entity.Property(e => e.Consumersnumber).HasColumnName("consumersnumber");
            entity.Property(e => e.Sessiondate).HasColumnName("sessiondate");
        });

        modelBuilder.Entity<Test>(entity =>
        {
            entity.HasKey(e => e.Internalid).HasName("test_pkey");

            entity.ToTable("test");

            entity.Property(e => e.Internalid)
                .HasMaxLength(20)
                .HasColumnName("internalid");
            entity.Property(e => e.Consumersnumber).HasColumnName("consumersnumber");
            entity.Property(e => e.Duedate).HasColumnName("duedate");
            entity.Property(e => e.Product).HasColumnName("product");
            entity.Property(e => e.Reportdeliverydate).HasColumnName("reportdeliverydate");
            entity.Property(e => e.Requestdate).HasColumnName("requestdate");
            entity.Property(e => e.Testtype)
                .HasMaxLength(2)
                .HasColumnName("testtype");
            entity.Property(e => e.Validationdate).HasColumnName("validationdate");

            entity.HasOne(d => d.ProductNavigation).WithMany(p => p.Tests)
                .HasForeignKey(d => d.Product)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("test_product_fkey");

            entity.HasMany(d => d.Sessions).WithMany(p => p.Tests)
                .UsingEntity<Dictionary<string, object>>(
                    "SessionTest",
                    r => r.HasOne<Session>().WithMany()
                        .HasForeignKey("Sessionid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("session_tests_sessionid_fkey"),
                    l => l.HasOne<Test>().WithMany()
                        .HasForeignKey("Testid")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("session_tests_testid_fkey"),
                    j =>
                    {
                        j.HasKey("Testid", "Sessionid").HasName("session_tests_pkey");
                        j.ToTable("session_tests");
                        j.IndexerProperty<string>("Testid")
                            .HasMaxLength(20)
                            .HasColumnName("testid");
                        j.IndexerProperty<string>("Sessionid")
                            .HasMaxLength(8)
                            .HasColumnName("sessionid");
                    });
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

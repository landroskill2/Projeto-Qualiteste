using Microsoft.EntityFrameworkCore;
using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.DataAccess.Concrete;
using Qualiteste.ServerApp.DataAccess.Repository;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Concrete;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<PostgresContext>();
builder.Services.AddScoped<DbContext, PostgresContext>();
builder.Services.AddSingleton(provider => builder.Configuration);
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IConsumerService, ConsumerService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<ITestService, TestService>();
builder.Services.AddScoped<ICsvService, CsvService>();

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment()) 
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();

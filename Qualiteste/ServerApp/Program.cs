using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Exchange.WebServices.Data;
using Microsoft.IdentityModel.Tokens;
using Qualiteste.ServerApp.DataAccess;
using Qualiteste.ServerApp.DataAccess.Concrete;
using Qualiteste.ServerApp.DataAccess.Repository;
using Qualiteste.ServerApp.Models;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Concrete;
using Qualiteste.ServerApp.Utils;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = TokenSettings.Issuer,
        ValidAudience = TokenSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(TokenSettings.Key)),
        RequireExpirationTime = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});
builder.Services.AddAuthorization();

// Add services to the container.
builder.Services.AddDbContext<PostgresContext>();
builder.Services.AddScoped<DbContext, PostgresContext>();
builder.Services.AddSingleton(provider => builder.Configuration);
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IConsumerService, ConsumerService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<ITestService, TestService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICsvService, CsvService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IClientService, ClientService>();


builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment()) 
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();
app.UseRouting();

app.MapControllers();

app.UseAuthentication();
app.UseAuthorization();

app.MapFallbackToFile("index.html");

app.Run();

#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install nodejs -yq \
    && apt-get install npm -y
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install nodejs -yq \
    && apt-get install npm -y
WORKDIR /src
COPY ["Qualiteste.csproj", "."]
RUN dotnet restore "./Qualiteste.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "Qualiteste.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Qualiteste.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Qualiteste.dll"]
# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore

# copy everything else and build app
COPY *.sln .
COPY . .
WORKDIR ./ClientApp
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install nodejs -yq \
    && apt-get install npm -y

WORKDIR /src
RUN dotnet publish ./Qualiteste.csproj -c Release -o /publish

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 as runtime
WORKDIR /publish
COPY --from=build /publish .
EXPOSE 44410
ENTRYPOINT ["dotnet", "Qualiteste.dll"]
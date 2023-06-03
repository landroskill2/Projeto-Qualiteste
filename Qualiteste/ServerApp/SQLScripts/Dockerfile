FROM postgres

USER postgres
WORKDIR /var/app

COPY forTesting.sql /docker-entrypoint-initdb.d/1_create.sql

COPY --chown=postgres:postgres dockerscripts/wait-for-postgres.sh ./bin/wait-for-postgres.sh
RUN chmod +x ./bin/wait-for-postgres.sh

EXPOSE 5432
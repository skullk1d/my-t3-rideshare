#!/bin/bash
# Populates fresh tables with mock data for users, collections, & bids

DB_CONTAINER_NAME="my-t3-auction-postgres"

# import env variables from .env
set -a
source .env

DB_PASSWORD=$(echo $DATABASE_URL | awk -F':' '{print $3}' | awk -F'@' '{print $1}')

PATH_SCRIPTS=dataset

# initialize table data from generated scripts (in order)
docker exec -it $DB_CONTAINER_NAME mkdir -p tmp/$PATH_SCRIPTS

# for d in ./dataset/*.sql; do
for d in users collections bids sequence
do
  # echo $PATH_SCRIPTS/$d
  docker cp $PATH_SCRIPTS/$d.sql $DB_CONTAINER_NAME:/tmp/$PATH_SCRIPTS
  docker exec -it $DB_CONTAINER_NAME psql -d my-t3-auction -U postgres -a -f /tmp/$PATH_SCRIPTS/$d.sql || exit 3
done

echo "Migrated mock tables successfully"

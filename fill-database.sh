#!/bin/bash
# Populates fresh tables with mock data for users, collections, & bids

DB_CONTAINER_NAME="my-t3-auction-postgres"

# import env variables from .env
set -a
source .env

DB_PASSWORD=$(echo $DATABASE_URL | awk -F':' '{print $3}' | awk -F'@' '{print $1}')

docker cp ./dataset/user.sql $DB_CONTAINER_NAME:/tmp/user.sql

docker exec -it $DB_CONTAINER_NAME psql -d my-t3-auction -U postgres -a -f /tmp/user.sql || exit 3

echo "Migrated mock tables successfully"

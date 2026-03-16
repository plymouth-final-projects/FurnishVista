#!/bin/bash

for file in src/main/resources/db/migration/*.sql
do
  echo "Running $file"
  docker exec -i architectlk-db psql -U postgres -d architectlk < "$file"
done
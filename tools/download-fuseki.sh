#!/bin/bash

curl https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-5.0.0.tar.gz --output tools/apache-jena-fuseki-5.0.0.tar.gz

cd tools

tar -xvf apache-jena-fuseki-5.0.0.tar.gz

rm apache-jena-fuseki-5.0.0.tar.gz

mv apache-jena-fuseki-5.0.0 fuseki

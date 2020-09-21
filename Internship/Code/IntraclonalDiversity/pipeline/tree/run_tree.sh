#!/bin/bash

source /home/administrator/anaconda3/bin/activate base 
BASEDIR=`dirname "${0}"`
cd "$BASEDIR"

mkdir ../usersFiles/$1/tree

#$2 number of clone to analyzed
for i in "$2"
do
  # --------------------------------------- tool to build the tree ------------------------------------------------------

  #translate the data in JSON format to analyse them 
  python3 clonotype_informations_json.py ../userName_C$i.nk ../usersFiles/$1/GTM/$1_repertoire_two_levels_info.json ($i+1)
  #to remplace with : (for the real data)
  #python3 clonotype_informations_json.py ../usersFiles/$1/tree/$1_C$i.nk ../usersFiles/$1/GTM/$1_repertoire_two_levels_info.json ($i+1)

done


#modify the statute of the date traitement in the database
mysql -u users -pBCRVisualizati0n! -D BCRVisualization -e "UPDATE users SET secondStep='done' WHERE userID=$1"

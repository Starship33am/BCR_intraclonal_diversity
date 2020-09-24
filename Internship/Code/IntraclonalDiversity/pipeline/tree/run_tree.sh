#!/bin/bash

source /home/administrator/anaconda3/bin/activate base 
BASEDIR=`dirname "${0}"`
cd "$BASEDIR"

mkdir ../usersFiles/$1/tree

#$2 number of clone to analyzed
for ((i=1; i<=$2; i++))
do
  # --------------------------------------- tool to build the tree ------------------------------------------------------

  #move the nk file in the user folder MUST BE DELETE WHEN THE TREE GENERATION TOOL WILL BE INTEGRATE
  cp ../false_values_tree/userName_C$i.nk ../usersFiles/$1/tree/$1_C$i.nk

  #translate the data in JSON format to analyse them 
  python3 clonotype_informations_json.py ../usersFiles/$1/tree/$1_C$i.nk ../usersFiles/$1/GTM/$1_repertoire_two_levels_info.json $i

done


#modify the statute of the date traitement in the database
mysql -u users -pBCRVisualizati0n! -D BCRVisualization -e "UPDATE users SET secondStep='done' WHERE userID=$1"

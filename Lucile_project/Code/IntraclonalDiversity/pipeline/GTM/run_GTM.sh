#!/bin/bash

source /home/administrator/anaconda3/bin/activate base 
BASEDIR=`dirname "${0}"`
cd "$BASEDIR"

mkdir ../usersFiles/$1/GTM
python3 format_labeling_imgt.py -s ../usersFiles/$1/1_Summary.txt -g ../usersFiles/$1/2_IMGT-gapped-nt-sequences.txt -o ../usersFiles/$1/GTM/$1_seq_Fo.txt
python3  initial_clustering.py -i ../usersFiles/$1/GTM/$1_seq_Fo_V_CDR3_Jseq.txt -o ../usersFiles/$1/GTM/$1_initial_clusters -s 0.7
python3 format_clustering_output.py -i ../usersFiles/$1/GTM/$1_initial_clusters_sameVJ_noallele_CDR3_0.7.txt -o ../usersFiles/$1/GTM/$1_initial_clusters_Fo.txt
#mv ../Data/$1_db-pass.tsv ../output
#mv ../Data/$1_scoper.txt ../output
#mv $1_seq_Fo.txt ../output
python3 refinement.py -f ../usersFiles/$1/GTM/$1_seq_Fo_V_CDR3_Jseq.txt -c ../usersFiles/$1/GTM/$1_initial_clusters_Fo.txt


python3 format_clustering_output.py -i ../usersFiles/$1/GTM/$1_seq_Fo_V_CDR3_Jseq_clone_V_CDR3_J.txt -o ../usersFiles/$1/GTM/$1_final_clusters_Fo.txt
python3 two_level_clonal_info.py -f ../usersFiles/$1/GTM/$1_seq_Fo_V_CDR3_Jseq.txt -c ../usersFiles/$1/GTM/$1_final_clusters_Fo.txt -n ../usersFiles/$1/GTM/$1
#mv $1_repertoire_two_levels_info.txt ../output
#mv $1_total_seq_info.txt ../output

#translate the data in JSON format to analyse them 
python3 clone_informations_json.py ../usersFiles/$1/GTM/$1_repertoire_two_levels_info.txt colors.txt


#modify the statute of the date traitement in the database
mysql -u users -pBCRVisualizati0n! -D BCRVisualization -e "UPDATE users SET firstStep='done' WHERE userID=$1"

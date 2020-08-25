#!/bin/bash

BASEDIR=`dirname "${0}"`
cd "$BASEDIR"

mkdir ../usersFiles/$1/GTM
python3 format_labeling_imgt.py -s ../usersFiles/$1/1_Summary.txt -g ../usersFiles/$1/2_IMGT-gapped-nt-sequences.txt -o $1_seq_Fo.txt
python3  initial_clustering.py -i $1_seq_Fo_V_CDR3_Jseq.txt -o $1_initial_clusters -s 0.7
python3 format_clustering_output.py -i $1_initial_clusters_sameVJ_noallele_CDR3_0.7.txt -o $1_initial_clusters_Fo.txt
#mv ../Data/$1_db-pass.tsv ../output
#mv ../Data/$1_scoper.txt ../output
#mv $1_seq_Fo.txt ../output
python3 refinement.py -f $1_seq_Fo_V_CDR3_Jseq.txt -c $1_initial_clusters_Fo.txt


python3 format_clustering_output.py -i $1_seq_Fo_V_CDR3_Jseq_clone_V_CDR3_J.txt -o $1_final_clusters_Fo.txt
python3 two_level_clonal_info.py -f $1_seq_Fo_V_CDR3_Jseq.txt -c $1_final_clusters_Fo.txt -n $1
#mv $1_repertoire_two_levels_info.txt ../output
#mv $1_total_seq_info.txt ../output

#translate the data in JSON format to analyse them 
python3 clone_informations_json.py $1_repertoire_two_levels_info.txt colors.txt

#move the files to the local repertory of the user
mv $1_repertoire_two_levels_info.txt ../usersFiles/$1/GTM
mv $1_total_seq_info.txt ../usersFiles/$1/GTM
mv $1_initial_clusters_sameVJ_noallele_CDR3_0.7.txt ../usersFiles/$1/GTM
mv $1_initial_clusters_unannotated_seq.txt ../usersFiles/$1/GTM
mv $1_seq_Fo_V_CDR3_Jseq_clone_V_CDR3_J.txt ../usersFiles/$1/GTM
mv $1_initial_clusters_Fo.txt ../usersFiles/$1/GTM
mv $1_final_clusters_Fo.txt ../usersFiles/$1/GTM
mv $1_seq_Fo_V_CDR3_Jseq.txt ../usersFiles/$1/GTM
mv $1_repertoire_two_levels_info.json ../usersFiles/$1/GTM
mv $1_repertoire_two_levels_info_clones.csv ../usersFiles/$1/GTM

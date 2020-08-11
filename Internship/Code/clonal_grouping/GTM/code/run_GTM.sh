#!/bin/bash

mkdir ../GTM/$1
python format_labeling_imgt.py -s ../IMGT_output/Real/$1_IMGT/1_Summary.txt -g ../IMGT_output/Real/$1_IMGT/2_IMGT-gapped-nt-sequences.txt -o $1_seq_Fo.txt
python  initial_clustering.py -i $1_seq_Fo_V_CDR3_Jseq.txt -o $1_initial_clusters -s 0.7
python format_clustering_output.py -i $1_initial_clusters_sameVJ_noallele_CDR3_0.7.txt -o $1_initial_clusters_Fo.txt
#mv ../Data/$1_db-pass.tsv ../output
#mv ../Data/$1_scoper.txt ../output
#mv $1_seq_Fo.txt ../output
python refinement.py -f $1_seq_Fo_V_CDR3_Jseq.txt -c $1_initial_clusters_Fo.txt


python format_clustering_output.py -i $1_seq_Fo_V_CDR3_Jseq_clone_V_CDR3_J.txt -o $1_final_clusters_Fo.txt
python two_level_clonal_info.py -f $1_seq_Fo_V_CDR3_Jseq.txt -c $1_final_clusters_Fo.txt -n $1
#mv $1_repertoire_two_levels_info.txt ../output
#mv $1_total_seq_info.txt ../output


mv $1_repertoire_two_levels_info.txt ../GTM/$1
mv $1_total_seq_info.txt ../GTM/$1
mv $1_initial_clusters_sameVJ_noallele_CDR3_0.7.txt ../GTM/$1
mv $1_initial_clusters_unannotated_seq.txt ../GTM/$1
mv $1_seq_Fo_V_CDR3_Jseq_clone_V_CDR3_J.txt ../GTM/$1
mv $1_initial_clusters_Fo.txt ../GTM/$1
mv $1_final_clusters_Fo.txt ../GTM/$1
mv $1_seq_Fo_V_CDR3_Jseq.txt ../formatted_imgt_output
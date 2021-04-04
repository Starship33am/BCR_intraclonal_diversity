#!/bin/bash

python changeo/bin/MakeDb.py imgt -i ../Data/$1
/usr/bin/Rscript --vanilla Run_scoper.R ../Data $1_db-pass.tsv $1_scoper.txt
python format_clustering_output.py -i ../Data/$1_scoper.txt -o ../output/$1_scoper_Fo.txt
python format_labeling_imgt.py -s ../Data/$1/1_Summary.txt -g ../Data/$1/2_IMGT-gapped-nt-sequences.txt -o $1_seq_Fo.txt

mv ../Data/$1_db-pass.tsv ../output
mv ../Data/$1_scoper.txt ../output
mv $1_seq_Fo.txt ../output

python two_level_clonal_info.py -f ../output/$1_seq_Fo.txt -c ../output/$1_scoper_Fo.txt -n $1
mv $1_repertoire_two_levels_info.txt ../output
mv $1_total_seq_info.txt ../output
#!/bin/bash



str=$1

#echo "$1/1_Summary.txt"
IFS='/' # delimiter
read -ra ADDR <<< "$str" # str is read into an array as tokens separated by IFS
name=${ADDR[@]: -1}
#name=${ADDR[-1]}
IFS=''



python format_labeling_imgt_airr.py -a $1/vquest_airr.tsv -o ${name}_seq_Fo.txt
python initial_clustering_f.py -i ${name}_seq_Fo_V_CDR3_Jseq.txt -o ${name} -s 0.7
python format_clustering_output.py -i ${name}_sameVJ_noallele_CDR3_0.7.txt -o ${name}_initial_clusters_Fo.txt
python refinement.py -f ${name}_seq_Fo_V_CDR3_Jseq.txt -c ${name}_initial_clusters_Fo.txt




python format_clustering_output.py -i ${name}_seq_Fo_V_CDR3_Jseq_clone_V_CDR3_J.txt -o ${name}_final_clusters_Fo.txt
python two_level_clonal_info.py -f ${name}_seq_Fo_V_CDR3_Jseq.txt -c ${name}_final_clusters_Fo.txt -n ${name}
#python Cluster_distribution_plot.py -n ${name} -c ${name}_final_clusters_Fo.txt

mv ${name}_final_clusters_Fo.txt $1/
mv ${name}_final_clusters_seq_info.txt $1/
mv ${name}_repertoire_two_levels_info.txt $1/
rm ${name}_initial_clusters_Fo.txt
#rm ${name}_seq_Fo_V_CDR3_Jseq.txt
rm ${name}_sameVJ_noallele_CDR3_0.7.txt
rm ${name}_seq_Fo_V_CDR3_Jseq_clone_V_CDR3_J.txt
echo "Done!"





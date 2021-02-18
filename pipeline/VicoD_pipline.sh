#!/bin/bash

str=$1

IFS='/' # delimiter
read -ra ADDR <<< "$str" # str is read into an array as tokens separated by IFS
name=${ADDR[@]: -1}
#name=${ADDR[-1]}
IFS=''
mkdir Output
mkdir Output/$1/
python Code/GTM/format_labeling_imgt_airr.py -a Input/$1/vquest_airr.tsv -o Output/$1/${name}_seq_Fo.txt >> Output/$1/${name}_log.txt
python Code/GTM/initial_clustering_f.py -i Output/$1/${name}_seq_Fo_V_CDR3_Jseq.txt -o Output/$1/${name} -s 0.7 >> Output/$1/${name}_log.txt
python Code/GTM/format_clustering_output.py -i Output/$1/${name}_sameVJ_noallele_CDR3_0.7.txt -o Output/$1/${name}_initial_clusters_Fo.txt >> Output/$1/${name}_log.txt
python Code/GTM/refinement.py -f Output/$1/${name}_seq_Fo_V_CDR3_Jseq.txt -c Output/$1/${name}_initial_clusters_Fo.txt >> Output/$1/${name}_log.txt
python Code/GTM/format_clustering_output.py -i Output/$1/${name}_seq_Fo_V_CDR3_Jseq_clone_V_CDR3_J.txt -o Output/$1/${name}_final_clusters_Fo.txt >> Output/$1/${name}_log.txt
python Code/GTM/two_level_clonal_info.py -f Output/$1/${name}_seq_Fo_V_CDR3_Jseq.txt -c Output/$1/${name}_final_clusters_Fo.txt -n ${name} >> Output/$1/${name}_log.txt

mv ${name}_final_clusters_seq_info.txt Output/$1/
mv ${name}_repertoire_two_levels_info.txt Output/$1/
rm Output/$1/${name}_initial_clusters_Fo.txt
rm Output/$1/${name}_seq_Fo_V_CDR3_Jseq.txt
rm Output/$1/${name}_sameVJ_noallele_CDR3_0.7.txt
rm Output/$1/${name}_seq_Fo_V_CDR3_Jseq_clone_V_CDR3_J.txt

python Code/select_clone/intraclonal_study_input_creator.py -r Output/$1/${name}_repertoire_two_levels_info.txt -c Output/$1/${name}_final_clusters_seq_info.txt -n Output/$1/${name} -s 5 >> Output/$1/${name}_log.txt
for i in {1..5}
	do
	for j in 30 200
	do
	python Code/select_clone/alignment_intraclonal.py -a Input/$1/vquest_airr.tsv -f Output/$1/${name}_${i}_seq_info.txt -n Output/$1/${name}_${i} -s ${j} >> Output/$1/${name}_log.txt
	python Code/clonalTree/clonalTree.py  -i Output/$1/${name}_${i}_${j}_selected_seq_uniq.aln.fa -o Output/$1/${name}_${i}_${j}.nk -a 0 -r 0 >> Output/$1/${name}_log.txt
	rm Output/$1/${name}_${i}_${j}_all.aln.fa
	rm Output/$1/${name}_${i}_${j}_selected_seq.fasta
	rm Output/$1/${name}_${i}_${j}_selected_seq.aln
	rm Output/$1/${name}_${i}_${j}_selected_seq_uniq.aln.fa
	done
	rm Output/$1/${name}_${i}_seq_info.txt
done

rm Output/$1/${name}_final_clusters_Fo.txt
rm Output/$1/${name}_final_clusters_seq_info.txt
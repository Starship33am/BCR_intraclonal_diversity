#!/usr/bin/env python3
#-*-coding:Utf-8-*-

#Recover the informations contained for the tree representation
#Three data must be pass in argument : a nk format file, the json file created after the GTM analysis and the number of the clone concerned. 

import sys
import json
from newick import load

#transform the class format of the tree into dictionary format and add the abundance value
def change_format(tree, num_clone):
	dict_tree = {}
	dict_tree["name"]=tree.name	#recover the name of the tree object
	dict_tree["length"]=tree._length	#recover the length of the tree object
	if tree.name in clonotype_name.keys():	#add the value of abundance if the name of the clone is find in the dictionary of abundance
		dict_tree["value"]=data["children"][num_clone]["children"][clonotype_name[tree.name]]["value"]
		dict_tree["value_rep"]=data["children"][num_clone]["children"][clonotype_name[tree.name]]["value_rep"]
		dict_tree["productivity"]=data["children"][num_clone]["children"][clonotype_name[tree.name]]["productivity"]
		dict_tree["cdr3"]=data["children"][num_clone]["children"][clonotype_name[tree.name]]["cdr3"]
		dict_tree["seq"]=data["children"][num_clone]["children"][clonotype_name[tree.name]]["seq"]
		dict_tree["color"]=data["children"][num_clone]["children"][clonotype_name[tree.name]]["color"]
		dict_tree["stroke"]=data["children"][num_clone]["children"][clonotype_name[tree.name]]["stroke"]
		dict_tree["style"]=data["children"][num_clone]["children"][clonotype_name[tree.name]]["style"]
		del clonotype_name[tree.name]	#delete the name of the clonotype from the list
	if(tree.descendants!=[]) :	#if the node of the tree had descendants we add a list of children
		dict_tree["children"]=tree.descendants	
		for i in range(len(tree.descendants)):		#browse the descendants  
			result = change_format(tree.descendants[i], num_clone)	#repeat the same actions as its parents (name, value, length)
			dict_tree["children"][i]=result		#add this descendant to the list of children
	return dict_tree	#return the translation of the tree

# ------------------------------------------------------------------------------------

#save the data in a file in json format
def save_json_format(file_name, data):
	#sort the clone depending on their abundance value
	output_file = open(file_name+".json", "w")	#open the output file
	json.dump(data, output_file, indent = 4, sort_keys = False)	#save the data in json format to the output file
	output_file.close()

# ------------------------------------------------------------------------------------

#check if two file have been put in argument
if(len(sys.argv)==4):

	#open the first file which contains the Newick format
	with open(sys.argv[1]) as file:
		newick_tree = load(file)	#function of newick package which allow to load Newick format into python object
	#open the second file which contains the abundance of the node
	with open(sys.argv[2]) as file:
		data = json.load(file)

	clonotype_name = {}
	for i in range(len(data["children"][int(sys.argv[3])-1]["children"])) :
		clonotype_name[data["children"][int(sys.argv[3])-1]["children"][i]["name"]]=i

	tree = change_format(newick_tree[0],int(sys.argv[3]))	#change the format of the tree to export it in JSON format

	tree["value"]=1		#add the value of abundance to the naive sequence
	tree["name"]="ighv"

	tree["color"]="#808080";
	tree["stroke"]="#808080";
	tree["style"]="none";
	print(tree)
	input_file = sys.argv[1].split(".nk")	#recover the file name

	save_json_format(input_file[0]+"_clonotype", tree)	#save data in json format
	
	




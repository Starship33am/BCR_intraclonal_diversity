#!/usr/bin/env python3
#-*-coding:Utf-8-*-

#Translate the txt format of file containing clone whith their clonotype in json format. It recover the output file provide from the GTM and IMGT analysis.
#The file in txt format to convert must be pass in argument and the file containning the html colo.

import sys
import json

# ------------------------------------------------------------------------------------

#save the html color in a file
def color_list(file):
	colors = []
	with open(file) as f:
		for line in f :
			colors.append("#"+line.split("\n")[0])
	return colors

# ------------------------------------------------------------------------------------

#randomly assign a color, a stroke and style to each node 
def attribute_color(tree, tab_color, tab_style, tab_index):

	for node in tree:
		
		node["color"]=colors[tab_index[0]]
		node["stroke"]=colors[tab_index[1]]
		node["style"]=stroke_style[tab_index[2]]

		if(tab_index[0]!=len(colors)-1):
			tab_index[0] += 1
		elif(tab_index[1]!=len(colors)-1):
			tab_index[0] = 0
			tab_index[1] += 1
		elif(tab_index[2]!=len(stroke_style)-1):
			tab_index[0] = 0
			tab_index[1] = 0
			tab_index[2] += 1
		else:
			tab_index[0] = 0
			tab_index[1] = 0
			tab_index[2] = 0

		if "children" in node.keys():
			attribute_color(node["children"], tab_color, tab_style, tab_index)

# ------------------------------------------------------------------------------------

#save the data in a file in json format
def save_json_format(file_name, data):
	#sort the clone depending on their abundance value
	sorted_output_file = open(file_name+".json", "w")	#open the output file
	json.dump(data, sorted_output_file, indent = 4, sort_keys = False)	#save the data in json format to the output file
	sorted_output_file.close()

# ------------------------------------------------------------------------------------

#save the data in a txt format file to allow the user to download this data
def save_text_format(file_name, data):
	output_file = open(file_name+"_clones.csv", "w")	#open the output file
	output_file.write(data)	#save the data in json format to the output file
	output_file.close()

# ------------------------------------------------------------------------------------

#check if one argument have been passed
if(len(sys.argv)==3):

	colors = color_list(sys.argv[2]) 	
	stroke_style = ["none", "10,10", "1,5"]
	index = [0,0,0]
	clones=[]
	num_clone = 1;
	productivity = {"productive": "yes","unproductive" : "no", "" : "/"}	#match for the productivity to complete the table of data
	#open the input file
	with open(sys.argv[1]) as file:
		for line in file :
			line = line.split("\n")	#delete the the line break at the end of the line
			[clone_name, clone_abundance, clonotype, idV, idJ, cdr3]=line[0].split("	")	#separates the columns
			clone_name = "C"+str(num_clone)
			clonotypes_list = clonotype.split("Clonotype ")
			clonotypes_list = clonotypes_list[1].split(" ")
			cdr3_list = cdr3.split(" ")
			#the clone doesn't have clonotypes
			if(len(clonotypes_list)==1):
				clones.append({"name":clone_name, "value":round(float(clone_abundance)*100,3), "idV":idV, "idJ":idJ, "cdr3":cdr3, "productivity":productivity[clonotypes_list[0].split(",")[1]]})
			#the cdr3 is the same for all the clonotypes
			elif(len(cdr3_list)==1):
				clonotypes = []
				for i in range(len(clonotypes_list)):
					clonotype_info = clonotypes_list[i].split(",") #contains the abundance of the clonotypes and the productivity
					clonotypes.append({"name":clone_name+"-"+str(i+1), "value":round(float(clonotype_info[0])*100,3), "value_rep":round(float(clone_abundance)*100*float(clonotype_info[0]),3), "productivity":productivity[clonotype_info[1]], "cdr3":cdr3, "seq":"/"})
				clones.append({"name":clone_name, "value":round(float(clone_abundance)*100,3), "idV":idV, "idJ":idJ, "cdr3":cdr3, "productivity":"/", "children":clonotypes})
			#each clonotype has a different cdr3
			else :
				clonotypes = []
				for i in range(len(clonotypes_list)):
					clonotype_info = clonotypes_list[i].split(",") #contains the abundance of the clonotypes and the productivity
					clonotypes.append({"name":clone_name+"-"+str(i+1), "value":round(float(clonotype_info[0])*100, 3), "value_rep": round(float(clone_abundance)*100*float(clonotype_info[0]), 3), "productivity":productivity[clonotype_info[1]], "cdr3":cdr3_list[i], "seq":"/"})
				clones.append({"name":clone_name, "value":round(float(clone_abundance)*100,3), "idV":idV, "idJ":idJ, "cdr3":cdr3_list[0], "productivity":"/", "children":clonotypes})
			num_clone += 1
			
	repertoire = {"value":100,"color":"#808080","stroke":"#808080","style":"none", "children": clones}	#contain the informations of the repertoire (clones, clonotypes)
	attribute_color(repertoire["children"], colors, stroke_style, index)	#add properties to nodes

	input_file = sys.argv[1].split(".txt")	#recover the file name

	save_json_format(input_file[0], repertoire)	#save data in json format

else:
	print("Please enter 2 files in argument")

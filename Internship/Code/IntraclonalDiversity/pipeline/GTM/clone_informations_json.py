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
			colors.append(line.split("\n")[0])
	return colors

# ------------------------------------------------------------------------------------

#change the index of the color, stroke and style
def change_index(tab_index,nb_colors,nb_stroke):

	if(tab_index[0]!=nb_colors-1):
		tab_index[0] += 1
	elif(tab_index[1]!=nb_colors-1):
		tab_index[0] = 0
		tab_index[1] += 1
	elif(tab_index[2]!=nb_stroke-1):
		tab_index[0] = 0
		tab_index[1] = 0
		tab_index[2] += 1
	else:
		tab_index[0] = 0
		tab_index[1] = 0
		tab_index[2] = 0

	return tab_index

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
	clone_index = [0,0,0]
	clones=[]
	num_clone = 1;
	productivity = {"productive": "yes","unproductive" : "no", "" : "/"}	#match for the productivity to complete the table of data
	#ext = os.path.splitext(sys.argv[1]) #recover the extension of the file
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
				clones.append({"name":clone_name, "value":round(float(clone_abundance)*100,3), "idV":idV, "idJ":idJ, "cdr3":cdr3, "productivity":productivity[clonotypes_list[0].split(",")[1]], "color":colors[clone_index[0]], "stroke":colors[clone_index[1]], "style":stroke_style[clone_index[2]]})
				clone_index = change_index(clone_index,len(colors),len(stroke_style))	#update the values of the index
			#the cdr3 is the same for all the clonotypes
			elif(len(cdr3_list)==1):
				clonotype_index = change_index([clone_index[0],0,0],len(colors),len(stroke_style))	#update the values of the index
				clonotypes = []
				for i in range(len(clonotypes_list)):
					clonotype_info = clonotypes_list[i].split(",") #contains the abundance of the clonotypes and the productivity
					clonotypes.append({"name":clone_name+"-"+str(i+1), "value":round(float(clonotype_info[0])*100,3), "value_rep":round(float(clone_abundance)*100*float(clonotype_info[0]),3), "productivity":productivity[clonotype_info[1]], "cdr3":cdr3, "color":colors[clonotype_index[0]], "stroke":colors[clonotype_index[1]], "style":stroke_style[clonotype_index[2]], "seq":"/"})
					clonotype_index = change_index(clonotype_index,len(colors),len(stroke_style))	#update the values of the index
				clones.append({"name":clone_name, "value":round(float(clone_abundance)*100,3), "idV":idV, "idJ":idJ, "cdr3":cdr3, "productivity":"/", "color":colors[clone_index[0]], "stroke":colors[clone_index[1]], "style":stroke_style[clone_index[2]], "children":clonotypes})
				clone_index = change_index(clone_index,len(colors),len(stroke_style))	#update the values of the index
			#each clonotype has a different cdr3
			else :
				clonotype_index = change_index([clone_index[0],0,0],len(colors),len(stroke_style))	#update the values of the index
				clonotypes = []
				for i in range(len(clonotypes_list)):
					clonotype_info = clonotypes_list[i].split(",") #contains the abundance of the clonotypes and the productivity
					clonotypes.append({"name":clone_name+"-"+str(i+1), "value":round(float(clonotype_info[0])*100, 3), "value_rep": round(float(clone_abundance)*100*float(clonotype_info[0]), 3), "productivity":productivity[clonotype_info[1]], "cdr3":cdr3_list[i], "color":colors[clonotype_index[0]], "stroke":colors[clonotype_index[1]], "style":stroke_style[clonotype_index[2]], "seq":"/"})
					clonotype_index = change_index(clonotype_index,len(colors),len(stroke_style))	#update the values of the index
				clones.append({"name":clone_name, "value":round(float(clone_abundance)*100,3), "idV":idV, "idJ":idJ, "cdr3":cdr3_list[0], "productivity":"/", "color":colors[clone_index[0]], "stroke":colors[clone_index[1]], "style":stroke_style[clone_index[2]], "children":clonotypes})
				clone_index = change_index(clone_index,len(colors),len(stroke_style))	#update the values of the index
			num_clone += 1
			
	repertoire = {"value":100,"color":"#808080","stroke":"#808080","style":"none", "children": clones}	#contain the informations of the repertoire (clones, clonotypes)

	input_file = sys.argv[1].split(".txt")	#recover the file name

	save_json_format(input_file[0], repertoire)	#save data in json format

else:
	print("Please enter 2 files in argument")

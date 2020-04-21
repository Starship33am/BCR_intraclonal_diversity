#!/usr/bin/env python3
#-*-coding:Utf-8-*-

#Translate the txt format of file containing clone whith their clonotype in json format.
#The file in txt format to convert must be pass in argument.

import sys
import json

#check if one argument have been put in argument
if(len(sys.argv)==2):
	#ext = os.path.splitext(sys.argv[1]) #recover the extension of the file
	dict_clone = {"children":list()}
	#open the input file
	with open(sys.argv[1]) as file:
		for line in file :
			data = line.split("\n")	#delete the the line break at the end of the line
			data = data[0].split("	")	#separates clone from clonotypes
			if(len(data)>2 and data[2]!="Clonotype 1"):
				clonotype = data[2].split()	#recover the value of the clonotype
				dict_clone["children"].append({"name": data[0], "value": data[1], "children": [{"value": clonotype[1]},{"value": clonotype[2]}]})	#save the data of the clone and its clonotypes
			else :
				dict_clone["children"].append({"name": data[0], "value": data[1]})

	in_file_name = sys.argv[1].split(".txt")	#recover the txt file name
	file_name = in_file_name[0] + ".json"	#add the extension to the file name
	
	output_file = open(file_name, "w")	#open the output file
	json.dump(dict_clone, output_file, indent = 4, sort_keys = False)	#save the data in json format to the output file
	output_file.close() 
	
else:
	print("Please enter a txt file in argument")

#VERIFIER QUE LE FICHIER N'EST PAS VIDE ET QU'IL SOIT BIEN AU FORMAT TXT

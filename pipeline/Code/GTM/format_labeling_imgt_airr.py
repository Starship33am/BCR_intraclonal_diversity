
import sys
from collections import Counter
from optparse import OptionParser
import time

#####################################################################
def read_output_file(filename):
	f=open(filename,"r")
	lines=f.readlines()
	f.close()
	return lines

#####################################################################
def dico_V_J_CDR3_format(AIRR):
	lines = read_output_file(AIRR)
	low_quality_seq=[]
	Dico={}
	for l in range(1,len(lines)):
		split=lines[l].split("\t")
		#split[13] is the sequence alignment, is better than the sequence because it starts at the beginig of the V and ends at the end of J 
		if 'n' in split[13].lower():
			low_quality_seq.append(l)
			#print (split[13].lower())
		else :
			functionality,V,J,CDR3,Jseq = "_","_","_","_","_"
			
			sequence_id = split[0]
			if split[4] != "":
				functionality = split[4]
			if split[9] != "":
				V = split[9].split(" ")[1]
				#print (V)
			if split[11] != "":
				J = split[11].split(" ")[1]
				#print (J)
			if split[28] != "":
				CDR3 = split[28].replace("#", ".")
			if split[89] != "":
				Jseq = split[89]
				#print (CDR3)
			Dico[sequence_id] = [functionality,V,J,CDR3,Jseq]
	print("Total sequence count : " , len(lines)-1)
	print("Number of low quality sequences that have been eliminated from the analysis : ",  len(low_quality_seq))
	print("Number of sequences to be analysed : ",  (len(lines)-1)-len(low_quality_seq))
	return Dico

#####################################################################				
def write_file(Dico_VJCDR3,output_file):
	outputname = output_file.split(".")[0]+"_V_CDR3_Jseq.txt"
	f = open(outputname,"w")
	for key in Dico_VJCDR3.keys():
		#print (Dico_VJCDR3[key])
		line = key + "\t" + Dico_VJCDR3[key][0] + "\t" + Dico_VJCDR3[key][1] + "\t" + Dico_VJCDR3[key][2] + "\t" + Dico_VJCDR3[key][3] + "\t" + Dico_VJCDR3[key][4] + "\n"
		f.write(line)
	f.close()
	return 0


####################################################################
def main():
	start_time = time.time()
	usage = "usage: format_labeling_imgt.py -a AIRR -o output_file"
	parser = OptionParser(usage)
	parser.add_option("-a", "--AIRR", dest="AIRR",
	      help="read data from AIRR")
	parser.add_option("-o", "--output_file",dest="output_file",
	      help="write data to output_file")
	(options, args) = parser.parse_args()
	if len(sys.argv) != 5:
		parser.error("incorrect number of arguments")
	
	AIRR_file = options.AIRR
	output_file = options.output_file
	time_start = time.perf_counter()
	Dico_VJCDR3 = dico_V_J_CDR3_format(AIRR_file)
	write_file(Dico_VJCDR3,output_file)
	print("The AIRR file reading step execution time : %s seconds " % (time.time() - start_time))


#####################################################################
if __name__ == "__main__":
	main()

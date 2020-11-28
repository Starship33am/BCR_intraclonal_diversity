from Bio import SeqIO
import numpy as np
from optparse import OptionParser
from scipy.spatial import distance
from MSTree import *
import sys 



def hamming_distance(chaine1, chaine2):
	return sum(c1 != c2 for c1, c2 in zip(chaine1, chaine2))


#Read fasta file, detect repeated sequences and naive
'''def readFasta(fastaFile):
	dico = {}
	naive = ""

	for record in SeqIO.parse(fastaFile, "fasta"):
		sequence = str(record.seq)
		if record.id == "naive":
			naive = sequence
		if sequence in dico.keys(): 
			dico[sequence] = dico[sequence] + 1
		else:
			dico[sequence] = 1
	return dico, naive

#Create array of colapsed sequences, detect root tree and generate array of sequence labels
def colapseSequences(dico, naive):
	count = 1
	root  = 0

	labels = [];  arraySeqs = [];
	
	for key in dico.keys():
		labels.append("Seq" + str(count) + "-" + str(dico[key]))
		if key == naive:
			root = count - 1
		arraySeqs.append(key)
		count = count + 1
	return labels, root, arraySeqs
'''

def readFasta(fastaFile):
	dico = {}
	naive = ""
	labels = [];  arraySeqs = [];
	count = 1; root  = 0

	for record in SeqIO.parse(fastaFile, "fasta"):
		if record.id not in dico.keys(): 
			dico[record.id] = str(record.seq)
			labels.append(record.id)
			arraySeqs.append(str(record.seq))
			count = count + 1
		
	return labels, root, arraySeqs

#create adjacent matrix from colpased sequences by using hamming distance
def createAdjMatrix(arraySeqs):
	adjMatrix = np.zeros((len(arraySeqs), len(arraySeqs)))

	for i in range(len(arraySeqs)):
		#for j in range(i+1, len(arraySeqs)):
		for j in range(0, len(arraySeqs)):
			adjMatrix[i][j] = hamming_distance(arraySeqs[i], arraySeqs[j])
	return adjMatrix


#===================================================================================
#						Main
#===================================================================================
def main():
	usage = usage = "python clonalTree.py -i <fastaFile> -o <outputFile> \n"
	parser = OptionParser(usage)
	parser.add_option("-i", "--fastaFile", dest="fastaFile",
		  help="sequences in fasta format")
	parser.add_option("-o", "--outputFile", dest="outputFile",
		  help="output file")
	
	(options, args) = parser.parse_args()
	if len(sys.argv) != 5:
		parser.error("incorrect number of arguments")
	
	fastaFile = options.fastaFile
	outputFile = options.outputFile
	#dico, naive = readFasta(fastaFile)
	labels, root, arraySeqs =  readFasta(fastaFile)
	print (labels)
	#sys.exit()
	adjMatrix = createAdjMatrix(arraySeqs)

	#print(adjMatrix)
	tree = kruskalMST(adjMatrix, root, labels)
	#print (MST)
	#tree = generateTreeFromMST(MST, root, labels)
	#tree = editTree(tree, adjMatrix, labels)
	tree.write(format=1, outfile=outputFile)
	print (tree.get_ascii(show_internal=True))  
	print ('done')

#===================================================================================
if __name__ == "__main__":
	main()


import numpy as np
import random
import random
from ete3 import Tree
import numpy as np
import sys 

# Find set of vertex i or Find i parent
def find(i, parent): 
	while parent[i] != i: 
		i = parent[i] 
	return i 

# Does union of i and j. It returns 
# false if i and j are already in same 
# set. 
def union(i, j, parent): 
	a = find(i, parent) 
	b = find(j, parent) 
	parent[a] = b
	return parent
	
# Finds MST using Kruskal's algorithm 
def kruskalMST(cost, root, labels): 
	INF = float('inf'); error = 0
	mincost = 0 # Cost of min MST 
	V = len(cost)
	MST = np.zeros((V, V))
	# Initialize sets of disjoint sets 
	parent = [i for i in range(V)] 
	for i in range(V): 
		parent[i] = i
	
	# Include minimum weight edges one by one 
	edge_count = 0
	tree = Tree()
	tree.add_child(name=labels[root])
	includeAfter = []
	#Debug to be removed
	#for j in range(len(cost)):
	#	print(cost[0][j])
	#sys.exit()

	while edge_count < V - 1: 
		min = INF 
		a = -1
		b = -1
		#Find the pair of vertex with minimum cost		
		for i in range(V): 
			for j in range(V): 
				if find(i, parent) != find(j, parent) and cost[i][j] < min:
					#print(i, j, cost[i][j])					
					min = cost[i][j] 
					a = i 
					b = j 
		parent = union(a, b, parent) 
		#print('Edge {}:({}, {}) cost:{}'.format(edge_count, labels[a], labels[b], min)) 
		tree, tp = addNodeTree(tree, labels[a], labels[b], min)
		#print (tree)#Debug to be removed
		if tp:
			includeAfter.append(tp); error +=1
		edge_count += 1
		mincost += min
   
	#print("Minimum cost= {}".format(mincost)) 
	#ToDo: Tem que ser while, enquanto tiver nodes para incluir, e remover da lista
	if includeAfter:
		while len(includeAfter) > 0:
			for ia in includeAfter:
				#print (ia)
				a, b, cs = ia
				tree, tp = addNodeTree(tree, a, b, cs)
				if len(tp) == 0:
					error -= 1
					includeAfter.remove(ia)
				
				
	if error == 0:
		print ('ok, no warnning')
	else:
		print ('ERROR, nodes not included')
	return tree


def editTree(t1, adjMatrix, labels):
	tr = Tree()
	ardColapsed = []
	for node in t1.traverse("preorder"):
		if node.is_root():
			#print ('1')
			children = node.get_children()
			for n in children:
				tr.add_child(name=n.name)
				#print ('2', n.name)
		else:
			G = tr.search_nodes(name=node.name)
			if (G):
				children = node.get_children()

				for n in children:
					#print ('3', n.name)
					if n.name not in ardColapsed:
						colapse = colapseNodes(n.name, children, node.name, adjMatrix, labels)
						if colapse:
							N = G[0].add_child(name=None) # Adds a empty branch or bifurcation
							n1 = N.add_child(name=n.name)
							ardColapsed.append(n.name)
							for c in colapse:
								#print ('col ', c)
								n2 = N.add_child(name=c)
								ardColapsed.append(c)
								#print(tr.get_ascii(show_internal=True))
						else:
							G[0].add_child(name=n.name)

	return tr
	

def colapseNodes(node, lnodes, parent, cost, labels):
    colapse = []
    #print ('---> ', node, lnodes, parent, labels)
    idNode = labels.index(node); idPar = labels.index(parent)
    for i in lnodes:
        idI = labels.index(i.name)
        #print ('nodes ', node, i.name)
        if i.name != node and cost[idNode][idI] <= cost[idNode][idPar] and cost[idNode][idI] <= cost[idI][idPar]:
            #print ('cost ',node, i.name, cost[idNode][idI]);print ('cost P ',node, parent, cost[idNode][idPar])
            colapse.append(i.name)
    return colapse

def addNodeTree(t, a, b, min):
	tp = ()
	G = t.search_nodes(name=a)
	
	if (G):
		G[0].add_child(name=b, dist=min)
	else:
		G = t.search_nodes(name=b)
		if (G):
			G[0].add_child(name=a, dist=min)
		else:
			print ("Warnning nodes do not exists: ", a, b)
			return t, (a, b, min)
	#print (t, tp)
	return t, tp

def takeRandomNode(included, labels,  D):
	#print ("LEN INC", len(included))
	random.seed(30)
	i = random.randint(0, D-1)
	while (labels[i] in included):
		i = random.randint(0, D-1)
	return i

def generateTreeFromMST(MST, root, labels):
	D = len(labels)
	t = Tree()
	iterr = 0
	random.seed(30)
	includedNodes = []; toInclude = []

	firstNodes = MST[root,:]
	print ('root', labels[root])
	#Include root node

	t.add_child(name=labels[root]) #include  node root
	includedNodes.append(labels[root])
	toInclude.append(root)

	#print (t); print (includedNodes); print (toInclude); print ("D = ", D)
	while (len(includedNodes) < D):
		#print ("included = ", len(includedNodes))
		if (len(toInclude) > 0):
			i = toInclude.pop(0)#; print ("i = ", i)
		else:
			i = takeRandomNode(includedNodes, labels, D); #print ("rand i = ", i)
   
		G = t.search_nodes(name=labels[i])
		#print (G)
		if (G):
			#G is a included node, so add its childrens
			for j in range(i+1, D):
				if MST[i][j] != 0: 
					#print ("i,j" , i, j)
					G[0].add_child(name=labels[j])
					if labels[j] not in includedNodes:
						includedNodes.append(labels[j])
						toInclude.append(j)
					
		else:
			#G is child find its patents
			for j in range(0, D):
				if MST[i][j] != 0:
					#print ("i,j 2" , i, j)
					G = t.search_nodes(name=labels[j])
					if G:
						G[0].add_child(name=labels[i])
						#print ('add', labels[i])
						if labels[i] not in includedNodes:
							includedNodes.append(labels[i])
					else:
						MST[j][i] = 1
		if iterr == 50:
			print (includedNodes.sort())
			print (t)
			sys.exit()
		print ('iter', iterr)
		iterr +=1
	
	return t


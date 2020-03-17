library("AbSim")
library(ape)


V=ighv_hum_df
#Single lineage
single.lineage.test <- AbSim::singleLineage(max.seq.num=20,max.timer=150,SHM.method="naive",baseline.mut = 0.0008,SHM.branch.prob = "identical", SHM.branch.param = 0.05, SHM.nuc.prob = 15/350, max.VDJ = 3, VDJ.branch.prob = 0.3,proportion.sampled = 1,sample.time = 30, chain.type="heavy",vdj.model="naive", vdj.insertion.mean=4,species="hum",vdj.insertion.stdv=2)
single.lineage.test[[1]] #The simulated nucleotide sequences
single.lineage.test[[1]][[1]] # The tree (the only one in the Single lineage mode)
single.lineage.test[[1]][[1]][1] # The germline sequence with the V-, D-, and J-genes simply appended to another
single.lineage.test[[1]][[1]][2] # Other simulated sequences

head(single.lineage.test[[1]][[1]]) # The germline genes 
head(substring(single.lineage.test[[1]][[1]],first=1,last=20)) # the same thing as above juste showing the first 20 character
single.lineage.test[[2]][[1]][1] # the VDJ used for the simulation 
single.lineage.test[[2]][[1]] # seq names 

#Corresponding seq and name 
single.lineage.test[[2]][[1]][2] #sequene  
single.lineage.test[[1]][[1]][2] #name 

single.lineage.test[[3]][[1]] #Phylogenetic tree (the only one in the Single lineage mode)
#Visualisation 
plot(single.lineage.test[[3]][[1]],cex=.5)
title(single.lineage.test[[2]][[1]][1]) # the germline genes 

#Write sequences in a fasta file
# with.germline = TRUE ===> write the germline sequence as the first sequence of the 
fasta.name = "name.fasta"
repertoireFastas(single.lineage.test, fasta.name, with.germline = TRUE)


saveRDS(single.lineage.test, file = "single.lineage.rds")


#Single lineage sampling
head(substring(single.lineage.test[[4]],first=1,last=20)) # Shows the sequences of the first sampling time point
head(single.lineage.test[[5]]) # Names corresponding to above sequences at same time point
single.lineage.test[[5]]


#Full Repertoires
full.repertoire.test <- AbSim::fullRepertoire(max.seq.num=30, max.timer=150, SHM.method="naive", baseline.mut = 0.0008, SHM.branch.prob = "identical", SHM.branch.param = 0.1, SHM.nuc.prob = 15/350, species="mus", VDJ.branch.prob = 0.8, proportion.sampled = 1, sample.time = 15,max.tree.num = 3, chain.type="heavy",vdj.model="naive", vdj.insertion.mean=4,vdj.insertion.stdv=2)
head(substring(full.repertoire.test[[1]][[1]],first=1,last=20)) # Sequences corresponding to first tree
head(substring(full.repertoire.test[[1]][[2]],first=1,last=20)) # Sequences corresponding to second tree

head(full.repertoire.test[[2]][[1]]) # The names corresponding to sequences found in the first tree,The tree ===> full.repertoire.test[[3]][[1]]
head(full.repertoire.test[[2]][[2]]) # The names corresponding to the sequences found in the second tree, The tree ===> full.repertoire.test[[3]][[2]]


plot(full.repertoire.test[[3]][[1]],cex=.5) # This shows the first simulated tree
title(full.repertoire.test[[2]][[2]][1]) # makes the germline sequence name the title

plot(full.repertoire.test[[3]][[3]],cex=.5) # This shows the third simulated tree
title(full.repertoire.test[[2]][[2]][1])

# Other phylogenetic tree properties (e.g., tip names) can be accessed by:
head(full.repertoire.test[[3]][[1]]$tip.label)

head(substring(full.repertoire.test[[4]][[2]],first=1,last=20)) # intermediate sequences at time point 20 for the second tree
head(full.repertoire.test[[5]][[2]]) # names of the intermediate sequences at time point 20 


expanded.test <- AbSim::clonalExpansion(ab.repertoire = full.repertoire.test,
                                        rep.size = 90,
                                        distribution = "id",
                                        with.germline = FALSE)
length(expanded.test[[1]]) # expected 90 sequences


# Extracting final sequences
only.sequences <- unlist(full.repertoire.test[[1]])
head(substring(only.sequences,first=1,last=20))
print(single.lineage.test[[3]][[1]]$tip.label[1]) # extracts the germline V,D,J genes used

#Removing germline tip from tree
tree.without.germline <- ape::drop.tip(single.lineage.test[[3]][[1]],tip=1)

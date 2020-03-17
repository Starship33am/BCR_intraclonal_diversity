
# Intraclonal diversity

The B-cells receptors (BCR) are the proteins capable of recognizing the antigen, the molecule coming from modified self-cells or harmful non-self invaders (pathogens). The recognition happens through direct contact between the variable zone of immunoglobulin (Ig) molecule in the BCR and the antigen. Affinity maturation comprises a series of modifications on the version of GCtreeBCR's structure that increases its affinity, avidity, and anti-pathogen activity. This process consists of multiple rounds of somatic hypermutation (SHM) of immunoglobulin genes in B cells, coupled to a Darwinian selection for antigen binding. Affinity maturation starts from the naive BCRs and implies a high selective pressure on its peptide sequence. It favors the multiplication of cells with accumulated SHM on the receptor genes, which have a higher affinity toward antigen. However, this selection process remains permissive to the BCR with different level of antigen affinity. Consequently, in the germline center, B-cells with germline-encoded receptors coexist with moderately to highly mutated Ig genes. Affinity maturation naturally forms a phylogenetic tree that has some specific features : 

- The BCR sequences of the same cellular lineage have restrained divergence.
- The abundance of sequences in the internal nodes can be rent none-zero.
- There is significant information about the ancestor BCR sequence (germline sequence).

It is also crucial to note that highly context dependency of SHM and the presence of high selective pressure in the germinal center violates independent-sites evolution and neutral-evolution assumptions in most phylogenetic substitution models and has real effects on BCR phylogenetic inference. These particularities suggest that a simplistic model with few free parameters can infer the tree for a BCR lineage. In this case, Maximum parsimony is intresting; the problem is the degenerate inference of this method, which creates several equally parsimonious trees.

We decided to study more profoundly a method that uses maximum parsimony and suggests a solution for a vast parsimony forest. The tool is called GC tree, and it uses the abundance of each genotype in the germline center as another essential source of information. GC tree ranks the equally parsimonious trees inferred by Phylip package with considering variable cellular  (genotype) abundance. The primary assumption here is that more abundant genotypes are likely to have more mutant descendant because there are more individuals available to mutate. The number of mutant offspring genotypes is, in turn, related to the number of surviving mutant offspring sampled. Thus, given two equally parsimonious trees, this intuition would prefer the tree that has more mutant descendants of a frequently observed node.

The GCtree reconstruct the phylogeny within clones of the same-length sequences. In our datasets,  clusters(clones) contain different-length sequences. We should align the sequences to even up their lengths. Sequence alignment creates gaps. GCtree considers the gap as the fifth nucleotide. In the case of sequences with a long gap, GCtree overestimates the number of evolutionary steps between sequences. Moreover, GCtree needs an "ancestor" sequence to infer the phylogeny. For the moment, the only way to generate the "ancestor" is to reverse the SHM on the most abundant sequence in a clone. The current version of GCtree cannot manage the high abundance of sequences; however, in some of our datasets, we have abundances up to 100000. 

Our questions are :

- Do Gctree reconstruct the phylogeny of a clone accurately? 
- How can we interpret the suggested phylogeny?
- How to solve the problem in phylogeny construction, caused by high sequence abundance?




### Refrences :

Kristian Davidsen, and Frederick Matsen. “Benchmarking Tree and Ancestral Sequence Inference for B Cell Receptor Sequences,” bioRxiv (2018). https://doi.org/10.1101/307736

DeWitt, William S, Luka Mesin, Gabriel D Victora, Vladimir N Minin, and Frederick A Matsen. “Using Genotype Abundance to Improve Phylogenetic Inference.” Edited by Aya Takahashi. Molecular Biology and Evolution 35, no. 5 (2018): 1253–65. https://doi.org/10.1093/.

Alexander Dimitri Yermanos, Andreas Kevin Dounas, Tanja Stadler, Annette Oxenius, and Sai T. Reddy. “Tracing Antibody Repertoire Evolution by Systems Phylogeny.” Frontiers in Immunology 9 (2018). https://doi.org/10.3389/fimmu.. 



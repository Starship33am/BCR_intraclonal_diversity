# Tutorial (main page)

# Upload

![Capture d’écran 2021-11-22 à 01.26.40.png](https://github.com/NikaAb/BCR_intraclonal_diversity/blob/master/Tutorial/Capture_decran_2021-11-22_a_01.26.40.png)

On this page, you can choose a name for your analysis, upload the AIRR file of the BCR repertoire, and provide an email address to receive a link to the outputs. You can check the required fields in the AIRR formatted file on this page **(link to AIRR FILE’S REQUIRED FIELDS FOR VICLOD PIPELINE)** Note that entering the email address is optional, it gives you the possibility to have access to your results for seven days. If you choose to not enter your email address, please make sure to keep the browser's window open, as long as you want to have access to the results. The analysis is relatively fast, for instance, it takes around three minutes to analyze a monoclonal repertoire containing 270 000 sequences. The required time can vary depending on the structure of the sample (the size of clusters and sequence mutations).

---

# Repertoire Analysis

![Capture d’écran 2021-11-22 à 01.27.39.png](https://github.com/NikaAb/BCR_intraclonal_diversity/blob/master/Tutorial/Capture_decran_2021-11-22_a_01.27.39.png)

![Capture d’écran 2021-11-22 à 01.28.26.png](https://github.com/NikaAb/BCR_intraclonal_diversity/blob/master/Tutorial/Capture_decran_2021-11-22_a_01.28.26.png)

1) **Repertoire view:** The outer circle (gray) represents the entire repertoire, while inner circles represent clones, their sizes are proportional to their abundance in the repertoires.

2) **Clone abundance:** Clone abundance is represented by the bars. You can choose a normal scale or logarithmic one. In both cases, you can define a threshold for analyzing the clonality of the repertoire, and see which clone bypasses this threshold.

3) **Clone details table:** Columns show the clone identifier, abundance in the repertoire (%), number of reads, IGHV gene identity, IGHJ gene identity, CDR3 amino acid sequence, and the gene productivity.

4) **Download:** All this information on the page, such as clone information and visualizations is available for download by clicking on the download button.

If you click on any clone with the name (C1, C2, ...) you will have access to its components. This leads you to the "Clonal analysis" page. Note that this step may take up to a few seconds based on the number of clonotypes, we invite you to wait after clicking once on the clone until the page changes.

---

# Clonal Analysis

![Capture d’écran 2021-11-22 à 01.29.40.png](https://github.com/NikaAb/BCR_intraclonal_diversity/blob/master/Tutorial/Capture_decran_2021-11-22_a_01.29.40.png)

![Capture d’écran 2021-11-22 à 01.30.13.png](https://github.com/NikaAb/BCR_intraclonal_diversity/blob/master/Tutorial/Capture_decran_2021-11-22_a_01.30.13.png)

1) **Clone view:** Each circle represents a clonotype of the selected clone (the light yellow circle). Circle sizes represent clonotype abundance within the clone.

2) **The general topology of the** **B-cell lineage:** In this tree, the triangle represents the hypothetical naive sequence [link to definition], and the square represents the largest clonotype. The most abundant clonotypes are colored. You can choose to change the color of the node according to the functionality of their sequence. Green nodes represent productive and red nodes represent unproductive rearrangements; unproductive sequences have stop codon(s). It is also possible to display the length of branches representing distances between sequences.

The lineage tree inferred at this step represents at most the 200 of the most abundant clonotypes of a clone. For large clones containing many clonotypes, interpreting the complete lineage tree can be demanding. You can choose to display the pruned version of the tree. The pruning [link to pruning algorithms] simplifies a tree while conserving nodes with high abundance and their evolutive path to the root.

3) **Clonotype details table:** Columns show the clonotype identifiers, abundances in the repertoire (%), abundance in the clone (%), CDR3 amino acid sequence, and functionality of the clonotype's representative sequence.

4) **Download**: You can download clonotype information by clicking on the download button.

To go back to the "Repertoire analysis" view and choose another clone to study, you can click on the analyzed clone area, on the "Clone view". To further analyze the intraclonal diversity, you can click on the "Intraclonal study" on top of the page.

---

# Intraclonal studies

![Capture d’écran 2021-11-22 à 01.32.03.png](https://github.com/NikaAb/BCR_intraclonal_diversity/blob/master/Tutorial/Capture_decran_2021-11-22_a_01.32.03.png)

![Capture d’écran 2021-11-22 à 01.32.26.png](https://github.com/NikaAb/BCR_intraclonal_diversity/blob/master/Tutorial/Capture_decran_2021-11-22_a_01.32.26.png)

1) **Lineage tree: c**olored circles represent observed clonotypes, while white circles represent unobserved nodes. The branch length represents the number of somatic hypermutations among connected clonotypes. We identify clonotypes by a number, sorted by their abundance, which means that clonotype **1** is the most abundant in the clone. Nodes that represent the largest clonotypes have a bold border in the tree. When passing the mouse over nodes, clonotype details (identifier, abundance functionality) appear. By clicking on “display abundance”, it is possible to display the abundance of each clonotype by increasing the size of the correspondent node. Nodes are then labeled with their abundance (%) rather than a sequential number. Each clonotype may contain multiple unique sequences [link to clonotype definition]. Choosing " Display proportion of unique sequence" will turn each node into a pie chart illustrating the numerical proportion of unique sequences within the clonotype.

2) **The circular bar chart**: this plot represents the distances (number of somatic hypermutations) between the ancestral and selected clonotypes’ sequences. By default, ViCloD displays the five most abundant clonotypes, but any clonotype can be included and/or removed from the plot with a maximum of eight clonotypes. Each colored section is related to a clonotype and represents the number of mutations observed between this clonotype and its parent in the tree. To highlight the tree path from a clonotype to the root, users should hover the mouse over their desired clonotype identifiers; to highlight a branch in the tree, one can hover the mouse over each section of the circular bar; it also displays the number of mutations between a pair of connected clonotypes.

3) **Multiple sequence alignment table:** To illustrate the conservation/mutations between representative sequences of each clonotype and ancestral sequences, we build a multiple sequence alignment with MUSCLE program [102] from the biopython “Bio.Align.Applications” package. For each sequence of this alignment, we have displayed multiple pieces of information separated by columns in the table: the identifier, the percentage and number of reads, the divergence rate (number of mutations) from the hypothetical naive sequence, and the percent deviation of IGHV sequence from the germline. Only the altered nucleotides of clonotype sequences compared to the hypothetical ancestor are shown in the alignment, whereas a dot represents conserved ones. CDR and framework sections are high-lighted with different colors, and the IGHD gene is underlined in each sequence. You can sort out sequences in the table based on each column. You can select one, multiple, or all the sequences and send them directly from the table to the IMGT/V-quest software. It is also possible to generate the Logo[link to Logo definition] of the CDR3 by clicking on "CDR3 Logo". The button with the sequence logo at the right of the table will display all the sequences on a new page.

4) **Download**: You can download clonotype information by clicking on the download button.

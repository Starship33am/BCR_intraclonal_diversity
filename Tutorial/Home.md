# Home

Welcome to ViCloD ! 


ViCloD is a web-based interactive tool that provides a visual analysis for B cell receptor (BCR) repertoire clonality and intra-clonal diversity. ViCloD is compatible with clinical applications since it can analyze hundreds of thousands of BCR sequences in a reasonable amount of time. The web server uses the PHP language, Java Script ([https://d3js.org/](https://d3js.org/)), bash and Python. This server has been implemented in the context of a collaboration between Frédéric Davi's group and Juliana Silva Bernardes (Sorbonne University). [Maybe add a phrase about the "sponsors" Ask Juliana and Frédéric]



Various text-based and video tutorials are incorporated in the "Tutorial" section, to assist you with your first steps using ViCloD. Multiple analized datasets in the "Example" page are provided to help you follow the tutorials step-by-step. Please check the various sections under "About" for further information about the refrences, and algorithms utilized, as well as the server's versions.



If you encounter an issue, have a question, or simply want to share your user experience with our team, please contact us via [add VicloD's email adress here]. We would also appreciate any suggestion of a specific feature for a future version. 



# Overview of ViCloD’s workflow. 


First, BCR sequences in **AIRR format [**Ref Glossary] are clustered into groups of clonally related sequences or **clones [interactive →** Ref Glossary]+ [Ref MOBILLE], and **clonotypes [interactive →** Ref Glossary] within each group are then identified. After that, for the N most abundant clones, **lineage trees  [**Ref Glossary]+ [Ref ClonalTree] are inferred. Multiple visualization modules and associated analyses are then available:
- BCR repertoire’s clonal analysis**[**Ref Tutorials/Video and Tutorials/text] 
- intra-clonal diversity analysis  **[**Ref Tutorials/Video and Tutorials/text] 
- lineage tree study **[**Ref Tutorials/Video and Tutorials/text].
- Anlysis of a sub set or all the sequences of a given clone via IMGT/Vquest **[**Ref Tutorials/Video and Tutorials/text] + [Ref IMGT]
- Generation of CDR3 logo of a clone **[**Ref Tutorials/Video and Tutorials/text] + [Ref VDJ-Logo]

![pipeline.png](Home%2021e81e33af414761bb5af32248aefb23/pipeline.png)

All the generated tables and images are downloadable in their static form.[Explain whether or not and for how long the analysis are stored on the web-server]

If you use VicloD for you research, please cite :

[Add ViCloD's paper ref]

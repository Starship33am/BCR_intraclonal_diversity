library("scoper")

args = commandArgs(trailingOnly=TRUE)
adress <- args[1]

#error
if (length(args)==0) {
  stop("At least one argument must be supplied (input file).n", call.=FALSE)
} else if (length(args)==1) {
  # default output file
  args[3] = "out.txt"
}

#setwd("/home/davi/Bureau/scoper2020/Scoper/Chage-o_output")

setwd(adress)
getwd()

dat<- read.table(args[2],sep="\t", header=TRUE,stringsAsFactors=FALSE)

dat[,4] = toupper(dat[,4]) # Junction sequences should be in uppercase

# clone data using defineClonesScope function

dataset <- defineClonesScoper(dat, junction = "junction", v_call = "v_call",j_call = "j_call", first = TRUE)


export <- dataset[,c("clone_id","sequence_id","junction")]
write.table(export, file = args[3], quote = FALSE, sep = "\t", row.names = FALSE,col.names = FALSE)


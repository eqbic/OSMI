data()
esoph
summary(esoph)

# show the number of cases of alcohol consumption by age
table(esoph$agegp, esoph$alcgp)

# show the number of cases of tobacco consumption by age
table(esoph$agegp, esoph$tobgp)

# average number of cases per age group
tapply(esoph$ncases, esoph$agegp, mean)

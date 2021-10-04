from pyspark import SparkContext, SparkConf

if __name__ == "__main__":
    conf = SparkConf().setAppName('word count').setMaster("local[3]")
    sc = SparkContext(conf = conf)
    words = sc.textFile("data/shakespeare.txt").flatMap(lambda line: line.split(" "))
    wordCounts = words.countByValue()
    
    wordsCountsSorted = sorted(wordCounts.items(), key=lambda x:x[1], reverse=True)
    i = 0
    for i in wordsCountsSorted[:25]:
        print(i[0], i[1])
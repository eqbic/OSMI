import numpy as np

def entropy(y):
    
    # occurence count of samples in the dataset
    occurrences = np.bincount(y)

    # probabilities of occurence for samples
    probabilities  = occurrences / len(y)

    entropy = -np.sum([p * np.log2(p) for p in probabilities if p > 0])

    return entropy

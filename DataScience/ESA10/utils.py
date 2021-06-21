from os import lstat
import numpy as np

def euclidean_distance(x1, x2):
    return np.sqrt(np.sum((x1 - x2) ** 2))

def normalize_data(X):
    max_value = np.max(X)
    min_value = np.min(X)
    normalized_X = []
    for x in X:
        normalized_value = (x - min_value) / (max_value - min_value)
        normalized_X.append(normalized_value)
    return np.array(normalized_X, dtype=np.float32)

def get_most_common(X):
    return max(set(X), key=X.count)
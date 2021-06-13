import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

iris_data = pd.read_csv('iris.csv')
sepal_length = iris_data['sepal_length'].to_numpy(dtype=np.float32)
sepal_width = iris_data['sepal_width'].to_numpy(dtype=np.float32)
iris_classes = iris_data['class'].to_numpy(dtype=np.str0)

# normalize all data
def normalize_array(array):
    array_max = max(array)
    array_min = min(array)
    normalized_array = []
    for value in array:
        normalize_value = (value - array_min) / (array_max - array_min)
        normalized_array.append(normalize_value)
    return np.array(normalized_array)




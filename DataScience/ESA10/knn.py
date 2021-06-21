import numpy as np
import utils


# EXERCISE 1
class KNN:
    def __init__(self, k=3):
        self.k = k
    
    def fit(self, X, y):
        # normalize training data
        self.X_train = utils.normalize_data(X)
        
        # no need to normalize train labels
        self.y_train = y

    def predict(self, X):
        # normalize input data
        normalized_X = utils.normalize_data(X)
        
        predicted_labels = [self._predict(x) for x in normalized_X]
        return np.array(predicted_labels) 

    def _predict(self,x):
        # compute distances from sample to all training samples
        distances = [utils.euclidean_distance(x, x_train) for x_train in self.X_train]

        # get indices of k nearest samples
        k_indices = np.argsort(distances)[:self.k]

        # get labels of k nearest samples
        k_nearest_labels = [self.y_train[i] for i in k_indices]

        # majority vote and find the most common label
        most_common = utils.get_most_common(k_nearest_labels)
        return most_common 
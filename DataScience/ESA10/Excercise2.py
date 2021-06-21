import numpy as np
from sklearn import datasets
import utils
from knn import KNN

iris = datasets.load_iris()
X_train, y_train = iris.data, iris.target

# Set K to the sqrt of the number of samples in the training set and round it
number_train_data = len(X_train)
K = int(np.floor(np.sqrt(number_train_data)))

# Sample to classify from Exercise 2
X_test = [[4.8,2.5,5.3,2.4]]

classifier = KNN(k=K)

classifier.fit(X_train, y_train)
predictions = classifier.predict(X_test)
print(predictions) # sample is 2 (virginica)
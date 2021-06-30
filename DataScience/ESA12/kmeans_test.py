import pandas as pd
import numpy as np
from kmeans import KMeans

df = pd.read_csv('data/edlich-kmeans-A0.csv', dtype=np.float32)
samples = [[df['V1'][i], df['V2'][i], df['V3'][i]] for i in range(len(df['V1']))]
X = np.array(samples)
print(X.shape)
k = KMeans(K=5, max_iterations=150, plot_steps=False)
y_pred = k.predict(X)
k.plot()
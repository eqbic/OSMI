import numpy as np
import matplotlib.pyplot as plt

def euclidean_distance(vector1, vector2):
    return np.sqrt(np.sum((vector1-vector2)**2))

class KMeans:

    def __init__(self,K=5, max_iterations=100, plot_steps=False):
        self.K = K
        self.max_iterations = max_iterations
        self.plot_steps = plot_steps

        # list of sample indices for each cluster
        self.clusters = [[] for _ in range(self.K)]
        # mean frature vector for each cluster
        self.centroids = []

    def predict(self, X):
        self.X = X
        self.n_samples, self.n_features = X.shape

        # initialize centroids
        random_sample_indices = np.random.choice(self.n_samples, self.K, replace=False)
        self.centroids = [self.X[index] for index in random_sample_indices]


        # optimization
        for _ in range(self.max_iterations):
            #update clusters
            self.clusters = self._create_clusters(self.centroids)
            if self.plot_steps:
                self.plot()

            # update centroids
            centroids_old = self.centroids
            self.centroids = self._get_centroids(self.clusters)
            if self.plot_steps:
                self.plot()
            # check if converged
            if self._is_converged(centroids_old, self.centroids):
                break
        # return cluster labels
        return self._get_cluster_labels(self.clusters)
    
    def _get_cluster_labels(self, clusters):
        labels = np.empty(self.n_samples)
        for cluser_index, cluster in enumerate(clusters):
            for sample_index in cluster:
                labels[sample_index] = cluser_index
        return labels
    
    def _create_clusters(self, centroids):
        clusters = [[] for _ in range(self.K)]
        for index, sample in enumerate(self.X):
            centroid_index = self._closest_centroid(sample, centroids)
            clusters[centroid_index].append(index)
        return clusters
    
    def _closest_centroid(self, sample, centroids):
        distances = [euclidean_distance(sample, point) for point in centroids]
        closest_index = np.argmin(distances)
        return closest_index
    
    def _get_centroids(self, clusters):
        centroids = np.zeros((self.K, self.n_features))
        for cluster_index, cluster in enumerate(clusters):
            cluster_mean = np.mean(self.X[cluster], axis=0)
            centroids[cluster_index] = cluster_mean
        return centroids
    
    def _is_converged(self, centroids_old, centroids):
        distances = [euclidean_distance(centroids_old[i], centroids[i]) for i in range(self.K)]
        return sum(distances) == 0
    
    def plot(self):
        fig = plt.figure()
        ax = fig.add_subplot(projection='3d')
        for i, index in enumerate(self.clusters):
            point = self.X[index].T
            ax.scatter(*point)
        
        for point in self.centroids:
            ax.scatter(*point, marker='x', color='black', linewidth=2)

        plt.show()
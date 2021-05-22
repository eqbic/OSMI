# 1
A = rand(3,3)
B = rand(3,3)
C = A + B

print("A: ")
display(A)
print("\n")
print("B: ")
display(B)
print("\n")
print("A + B: ")
display(C)
print("\n")

#2
# normal matrix multiplication
D = A * B
print("A * B: ")
display(D)
print("\n")

# Element-wise multiplication
E = A .* B
print("A .* B: ")
display(E)
print("\n")

#3
F = A \ B
print("A \\ B: ")
display(F)
print("\n")

G = A / B
print("A / B: ")
display(G)
print("\n")

#4
A = [[1,2,3] [4,5,6] [7,8,9]]
B = A + 1 # Error
B = A -1 # Error
B = A * 2 # Element-wise multiplication
B = A / 2 # Element-wise division
println(B)

#5
matrix = rand(3,4)
vector = [1.1,2.2,3.3,4.4]
produt = matrix * vector
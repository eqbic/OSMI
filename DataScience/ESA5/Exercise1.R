random_number <- sample(seq(1,100), size = 1)
input <- 0

while(input != random_number){
    input <- readline(prompt = "Guess a number between 1 and 100: ")
    if(input < random_number){
        print("Too Low. Again!")
    }else if(input > random_number){
        print("Too High. Again!")
    }else{
        print("Correct!")
    }
}

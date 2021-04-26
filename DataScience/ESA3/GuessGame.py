import random

def start_game():
    number_to_guess = random.randint(1, 100)
    guess = 0
    attempts = 0

    print('Hello! Are you ready for a little guessing game? Just guess a'\
         'number between 1 and 100.\n')
         
    while guess != number_to_guess:
        try:
            guess = float(input('Whats your guess?: '))
        except ValueError:
            print('Sorry, only numbers are allowed. Try again!')
            continue

        attempts += 1
        if guess < number_to_guess:
            print('Ups! You have to guess again. Your number is too low.')
        elif guess > number_to_guess:
            print('Sorry, your number is too high. Guess again!')
    
    print(f'Yeah! You got the right number! And it only took {attempts} '\
        'attempts!')

if __name__ == "__main__":
    start_game()
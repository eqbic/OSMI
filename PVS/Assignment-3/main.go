package main

import (
	"fmt"
	"sync"
)

type CardinalDirection int
type Axis int
type Colour int

const (
	North CardinalDirection = iota
	East
	South
	West
)

func (direction CardinalDirection) String() string {
	switch direction {
	case North:
		return "North"
	case East:
		return "East"
	case South:
		return "South"
	case West:
		return "West"
	default:
		return "Unkwown direction"
	}
}

const (
	NorthSouth Axis = iota
	EastWest
)

const (
	Red Colour = iota
	Green
	Yellow
)

func (color Colour) String() string {
	switch color {
	case Red:
		return "Red"
	case Yellow:
		return "Yellow"
	case Green:
		return "Green"
	default:
		return "Unknown color"
	}
}

func nextDirection(cur CardinalDirection) CardinalDirection {
	return (cur + 1) % 4
}

func nextColour(cur Colour) Colour {
	return (cur + 1) % 3
}

func axis(direction CardinalDirection) Axis {
	if direction == North || direction == South {
		return NorthSouth
	}
	return EastWest
}

type TrafficLight struct {
	direction               CardinalDirection
	colour                  Colour
	axisChannel             chan Axis
	trafficLightShown       bool
	amountReady             chan int
	axisShown               chan bool
	amountChange            chan int
	readyForDirectionChange bool
}

func (t *TrafficLight) Show() {
	fmt.Printf("%s is %s.\n", t.direction, t.colour)
}

func (t *TrafficLight) Run(wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		currentAmountReady := <-t.amountReady
		currentAmountChange := <-t.amountChange
		currentAxisShown := <-t.axisShown
		currentAxis := <-t.axisChannel

		// fmt.Printf("Direction: %s, AmountReady: %d, AmountChange: %d, ReadyChange: %t\n", t.direction, currentAmountReady, currentAmountChange, t.readyForDirectionChange)
		if currentAxis == axis(t.direction) && !t.readyForDirectionChange {
			if !t.trafficLightShown {
				if !currentAxisShown {
					t.colour = nextColour(t.colour)
					t.Show()
					t.trafficLightShown = true
					currentAmountReady = currentAmountReady + 1
					t.amountReady <- currentAmountReady
					currentAmountChange = 0
					t.amountChange <- currentAmountChange
				} else {
					t.amountReady <- currentAmountReady
					t.amountChange <- currentAmountChange
				}
			} else {
				if !currentAxisShown {
					t.amountReady <- currentAmountReady
					t.amountChange <- currentAmountChange
				} else {
					t.trafficLightShown = false
					currentAmountReady = currentAmountReady - 1
					t.amountReady <- currentAmountReady

					if t.colour == Red {
						t.readyForDirectionChange = true
						currentAmountChange = currentAmountChange + 1
						t.amountChange <- currentAmountChange
					} else {
						t.readyForDirectionChange = false
						t.amountChange <- 0
					}
				}
			}

			if currentAmountReady == 0 {
				t.axisShown <- false
			} else if currentAmountReady > 1 {
				t.axisShown <- true
			} else {
				t.axisShown <- currentAxisShown
			}

		} else {
			t.amountReady <- currentAmountReady
			t.amountChange <- currentAmountChange
			t.axisShown <- currentAxisShown
			t.readyForDirectionChange = false
		}

		if currentAmountChange == 2 {
			t.axisChannel <- axis(nextDirection(t.direction))
		} else {
			t.axisChannel <- currentAxis
		}
	}
}

func main() {
	var wg sync.WaitGroup
	axisChannel := make(chan Axis)
	amountReady := make(chan int)
	axisShown := make(chan bool)
	amountChange := make(chan int)
	for i := North; i <= West; i++ {
		wg.Add(1)
		trafficLight := TrafficLight{
			direction:               i,
			colour:                  Red,
			axisChannel:             axisChannel,
			trafficLightShown:       false,
			amountReady:             amountReady,
			axisShown:               axisShown,
			amountChange:            amountChange,
			readyForDirectionChange: false,
		}
		go trafficLight.Run(&wg)
	}

	go func() {
		amountReady <- 0
		amountChange <- 0
		axisShown <- false
		axisChannel <- NorthSouth
	}()
	wg.Wait()
}

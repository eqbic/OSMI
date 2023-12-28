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
	direction    CardinalDirection
	colour       Colour
	axisChannel  chan Axis
	colorChannel chan Colour
	isReady      bool
	firstReady   chan bool
	secondReady  chan bool
}

func (t *TrafficLight) Show() {
	fmt.Printf("%s is %s.\n", t.direction, t.colour)
}

func (t *TrafficLight) Run(wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		currentAxis := <-t.axisChannel
		isFirstReady := <-t.firstReady
		isSecondReady := <-t.secondReady

		// if currentAxis == axis(t.direction) {
		// 	t.axisChannel <- axis(t.direction)
		// 	// i am the first trafficlight to change color
		// 	if !t.isReady && !isFirstReady {
		// 		t.isReady = true
		// 		t.colour = nextColour(t.colour)
		// 		t.colorChannel <- t.colour
		// 		t.firstReady <- true
		// 	} else {
		// 		t.colorChannel <- currentColor
		// 		t.firstReady <- isFirstReady
		// 	}

		// 	// // i am the second trafficlight to change color
		// 	if !t.isReady && isFirstReady {
		// 		t.isReady = true
		// 		t.colour = currentColor
		// 		t.secondReady <- true
		// 	} else {
		// 		t.secondReady <- isSecondReady
		// 	}

		// 	// axis is ready
		// 	if isFirstReady && isSecondReady {
		// 		t.Show()
		// 	}

		// 	// t.firstReady <- isFirstReady
		// 	// t.secondReady <- isSecondReady

		// } else {
		// }

		if currentAxis == axis(t.direction) {
			if !t.isReady {
				t.colour = nextColour(t.colour)
			}

		} else {
			t.axisChannel <- currentAxis
			t.firstReady <- isFirstReady
			t.secondReady <- isSecondReady
		}

	}
}

func main() {
	var wg sync.WaitGroup
	axisChannel := make(chan Axis)
	firstReady := make(chan bool)
	secondReady := make(chan bool)
	for i := North; i <= West; i++ {
		wg.Add(1)
		trafficLight := TrafficLight{
			direction:   i,
			colour:      Red,
			axisChannel: axisChannel,
			isReady:     false,
			firstReady:  firstReady,
			secondReady: secondReady,
		}
		go trafficLight.Run(&wg)
	}

	go func() {
		axisChannel <- NorthSouth
		firstReady <- false
		secondReady <- false
	}()
	wg.Wait()
}

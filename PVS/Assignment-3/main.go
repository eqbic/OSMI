// package main

// import (
// 	"fmt"
// )

// type CardinalDirection int
// type Axis int
// type Colour int

// const (
// 	North CardinalDirection = iota
// 	East
// 	South
// 	West
// )

// func (direction CardinalDirection) String() string {
// 	switch direction {
// 	case North:
// 		return "North"
// 	case East:
// 		return "East"
// 	case South:
// 		return "South"
// 	case West:
// 		return "West"
// 	default:
// 		return "Unkwown direction"
// 	}
// }

// const (
// 	NorthSouth Axis = iota
// 	EastWest
// )

// const (
// 	Red Colour = iota
// 	Green
// 	Yellow
// )

// func (color Colour) String() string {
// 	switch color {
// 	case Red:
// 		return "Red"
// 	case Yellow:
// 		return "Yellow"
// 	case Green:
// 		return "Green"
// 	default:
// 		return "Unknown color"
// 	}
// }

// func nextDirection(cur CardinalDirection) CardinalDirection {
// 	return (cur + 1) % 4
// }

// func nextColour(cur Colour) Colour {
// 	return (cur + 1) % 3
// }

// func axis(direction CardinalDirection) Axis {
// 	if direction == North || direction == South {
// 		return NorthSouth
// 	}
// 	return EastWest
// }

// type TrafficLight struct {
// 	direction    CardinalDirection
// 	colour       Colour
// 	isReady      bool
// 	axisChannel  chan Axis
// 	colorChannel chan Colour
// 	firstReady   chan bool
// 	secondReady  chan bool
// }

// func (t *TrafficLight) Show() {
// 	fmt.Printf("%s is %s.\n", t.direction, t.colour)
// }

// func (t *TrafficLight) Run() {
// 	for {
// 		// trafficlight is part of current active currentAxis
// 		currentAxis := <-t.axisChannel
// 		if currentAxis == axis(t.direction) {
// 			// I am the first light
// 			if !t.isReady {
// 				t.colour = nextColour(t.colour)
// 				t.isReady = true
// 				t.firstReady <- true
// 				t.colorChannel <- t.colour
// 				t.Show()
// 			}
// 			// I am the second light
// 			if !t.isReady && <-t.firstReady {
// 				t.colour = <-t.colorChannel
// 				t.isReady = true
// 				t.secondReady <- true
// 				t.Show()
// 			}

// 			if <-t.secondReady {
// 				t.isReady = false
// 				t.firstReady <- false
// 				t.secondReady <- false
// 			}

// 			// if <-t.secondReady && t.colour == Red {
// 			// 	t.axisChannel <- axis(nextDirection(t.direction))
// 			// }
// 		}

// 	}
// }

// func main() {

// 	axisChannel := make(chan Axis)    // synchronizes which axis is going to change
// 	colorChannel := make(chan Colour) // synchronize color of active axis
// 	firstReady := make(chan bool)
// 	secondReady := make(chan bool)

// 	for i := North; i <= West; i++ {
// 		trafficLight := TrafficLight{
// 			direction:    i,
// 			colour:       Red,
// 			isReady:      false,
// 			axisChannel:  axisChannel,
// 			colorChannel: colorChannel,
// 			firstReady:   firstReady,
// 			secondReady:  secondReady,
// 		}
// 		go trafficLight.Run()
// 	}

// 	axisChannel <- NorthSouth
// 	select {}
// }

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
		currentColor := <-t.colorChannel
		isFirstReady := <-t.firstReady
		isSecondReady := <-t.secondReady

		if currentAxis == axis(t.direction) {
			t.Show()

			t.axisChannel <- axis(t.direction)
			// i am the first trafficlight to change color
			if !t.isReady && !isFirstReady {
				t.isReady = true
				t.colour = nextColour(t.colour)
				t.colorChannel <- t.colour
				t.firstReady <- true
			} else {
				t.colorChannel <- currentColor
				t.firstReady <- isFirstReady
			}

			// // i am the second trafficlight to change color
			if !t.isReady && isFirstReady {
				t.isReady = true
				t.colour = currentColor
				t.secondReady <- true
			} else {
				t.secondReady <- isSecondReady
			}

			// t.firstReady <- isFirstReady
			// t.secondReady <- isSecondReady

		} else {
			t.axisChannel <- currentAxis
			t.colorChannel <- currentColor
			t.firstReady <- isFirstReady
			t.secondReady <- isSecondReady
		}
	}
}

func main() {
	var wg sync.WaitGroup
	axisChannel := make(chan Axis)
	colorChannel := make(chan Colour)
	firstReady := make(chan bool)
	secondReady := make(chan bool)
	for i := North; i <= West; i++ {
		wg.Add(1)
		trafficLight := TrafficLight{
			direction:    i,
			colour:       Red,
			axisChannel:  axisChannel,
			colorChannel: colorChannel,
			isReady:      false,
			firstReady:   firstReady,
			secondReady:  secondReady,
		}
		go trafficLight.Run(&wg)
	}

	go func() {
		axisChannel <- NorthSouth
		colorChannel <- Red
		firstReady <- false
		secondReady <- false
	}()
	wg.Wait()
}

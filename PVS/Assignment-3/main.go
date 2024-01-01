package main

import (
	"fmt"
	"sync"
)

type CardinalDirection int
type Axis int
type Colour int

// enum to describe different cardinal directions
const (
	North CardinalDirection = iota
	East
	South
	West
)

// helper method to print direction as string
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

// enum to describe axis
const (
	NorthSouth Axis = iota
	EastWest
)

// enum to describe color
const (
	Red Colour = iota
	Green
	Yellow
)

// helper method to print color as string
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

// helper constants to avoid magic numbers
const numberOfDirections CardinalDirection = 4
const numberOfColors Colour = 3
const numberTrafficlightsPerAxis = 2

// returns next direction of given direction: North->East->South->West
func nextDirection(direction CardinalDirection) CardinalDirection {
	return (direction + 1) % numberOfDirections
}

// return next color of given color: Red->Green->Yellow
func nextColour(color Colour) Colour {
	return (color + 1) % numberOfColors
}

// helper method to get the axis which the given direction is on
func axis(direction CardinalDirection) Axis {
	if direction == North || direction == South {
		return NorthSouth
	}
	return EastWest
}

// custom type which describes a trafficlight
type TrafficLight struct {
	direction                           CardinalDirection
	colour                              Colour
	activeAxis                          chan Axis
	trafficLightShown                   bool
	numberTrafficlightsChangedColor     chan int
	axisShown                           chan bool
	numberTrafficlightsChangedDirection chan int
	readyForDirectionChange             bool
}

// prints the current color of the traffic light
func (t *TrafficLight) Show() {
	fmt.Printf("%s is %s.\n", t.direction, t.colour)
}

func (t *TrafficLight) Run(wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		// read current values from channels
		numberTrafficlightsChangedColor := <-t.numberTrafficlightsChangedColor
		numberTrafficlightsChangedDirection := <-t.numberTrafficlightsChangedDirection
		axisShown := <-t.axisShown
		activeAxis := <-t.activeAxis

		// only consider trafficlight if it is part of the active axis
		if activeAxis == axis(t.direction) && !t.readyForDirectionChange {
			// the current trafficlight has not changed color yet
			if !t.trafficLightShown {
				if !axisShown {
					// change color to next color and show it
					t.colour = nextColour(t.colour)
					t.Show()
					// mark that this trafficlight has changed color
					t.trafficLightShown = true
					// increase the amount of trafficlights which already changed the color and write to channel
					numberTrafficlightsChangedColor = numberTrafficlightsChangedColor + 1
					t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor
					numberTrafficlightsChangedDirection = 0
					t.numberTrafficlightsChangedDirection <- numberTrafficlightsChangedDirection
				} else {
					t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor
					t.numberTrafficlightsChangedDirection <- numberTrafficlightsChangedDirection
				}
			} else {
				if !axisShown {
					// this trafficlight already changed the color. waiting for the second trafficlight
					t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor
					t.numberTrafficlightsChangedDirection <- numberTrafficlightsChangedDirection
				} else {
					// both trafficlights have already changed the color. each trafficlight resets the shown flag and
					// decrease the number of trafficlights which already changed color and writes this value to the channel.
					t.trafficLightShown = false
					numberTrafficlightsChangedColor = numberTrafficlightsChangedColor - 1
					t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor

					// if the current color is red its time for a direction change. the trafficlights sets the direction
					// change flag to true and increases the number of trafficlights which are ready for a change and writes
					// to the channels.
					if t.colour == Red {
						t.readyForDirectionChange = true
						numberTrafficlightsChangedDirection = numberTrafficlightsChangedDirection + 1
						t.numberTrafficlightsChangedDirection <- numberTrafficlightsChangedDirection
					} else {
						t.readyForDirectionChange = false
						t.numberTrafficlightsChangedDirection <- 0
					}
				}
			}

			if numberTrafficlightsChangedColor == 0 {
				t.axisShown <- false
			} else if numberTrafficlightsChangedColor > 1 {
				t.axisShown <- true
			} else {
				t.axisShown <- axisShown
			}

		} else {
			// the trafficlight is not on the active axis. it just writes the read values back to the channels.
			t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor
			t.numberTrafficlightsChangedDirection <- numberTrafficlightsChangedDirection
			t.axisShown <- axisShown
			t.readyForDirectionChange = false
		}

		// if all trafficlights on the active axis are ready to change directions, set active axis to next axis
		if numberTrafficlightsChangedDirection == numberTrafficlightsPerAxis {
			t.activeAxis <- axis(nextDirection(t.direction))
		} else {
			t.activeAxis <- activeAxis
		}
	}
}

func main() {
	var wg sync.WaitGroup
	// channel to synchronize the current active axis
	activeAxis := make(chan Axis)
	// channel to communicate the number of trafficlights which already changed the color (0, 1 or 2)
	numberTrafficlightsChangedColor := make(chan int)
	// channel to communicate whether all trafficlights on the active axis have shown the current color.
	axisShown := make(chan bool)
	// channel to communicate the number of trafficlights which already changed the active axis.
	numberTrafficlightsChangedDirection := make(chan int)
	// create trafficlights for each direction and call Run for each as goroutine.
	for i := North; i <= West; i++ {
		wg.Add(1)
		trafficLight := TrafficLight{
			direction:                           i,
			colour:                              Red,
			activeAxis:                          activeAxis,
			trafficLightShown:                   false,
			numberTrafficlightsChangedColor:     numberTrafficlightsChangedColor,
			axisShown:                           axisShown,
			numberTrafficlightsChangedDirection: numberTrafficlightsChangedDirection,
			readyForDirectionChange:             false,
		}
		go trafficLight.Run(&wg)
	}
	// init the system and set acitve axis to north-south.
	go func() {
		numberTrafficlightsChangedColor <- 0
		numberTrafficlightsChangedDirection <- 0
		axisShown <- false
		activeAxis <- NorthSouth
	}()
	wg.Wait()
}

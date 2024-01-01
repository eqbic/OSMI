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
const number_of_directions CardinalDirection = 4
const number_of_colors Colour = 3

// returns next direction of given direction: North->East->South->West
func nextDirection(direction CardinalDirection) CardinalDirection {
	return (direction + 1) % number_of_directions
}

// return next color of given color: Red->Green->Yellow
func nextColour(color Colour) Colour {
	return (color + 1) % number_of_colors
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
	direction                       CardinalDirection
	colour                          Colour
	activeAxis                      chan Axis
	trafficLightShown               bool
	numberTrafficlightsChangedColor chan int
	axisShown                       chan bool
	numberTrafficlightsChangedAxis  chan int
	readyForDirectionChange         bool
}

// prints the current color of the traffic light
func (t *TrafficLight) Show() {
	fmt.Printf("%s is %s.\n", t.direction, t.colour)
}

func (t *TrafficLight) Run(wg *sync.WaitGroup) {
	defer wg.Done()
	for {

		numberTrafficlightsChangedColor := <-t.numberTrafficlightsChangedColor
		numberTrafficlightsChangedAxis := <-t.numberTrafficlightsChangedAxis
		axisShown := <-t.axisShown
		activeAxis := <-t.activeAxis

		if activeAxis == axis(t.direction) && !t.readyForDirectionChange {
			if !t.trafficLightShown {
				if !axisShown {
					t.colour = nextColour(t.colour)
					t.Show()
					t.trafficLightShown = true
					numberTrafficlightsChangedColor = numberTrafficlightsChangedColor + 1
					t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor
					numberTrafficlightsChangedAxis = 0
					t.numberTrafficlightsChangedAxis <- numberTrafficlightsChangedAxis
				} else {
					t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor
					t.numberTrafficlightsChangedAxis <- numberTrafficlightsChangedAxis
				}
			} else {
				if !axisShown {
					t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor
					t.numberTrafficlightsChangedAxis <- numberTrafficlightsChangedAxis
				} else {
					t.trafficLightShown = false
					numberTrafficlightsChangedColor = numberTrafficlightsChangedColor - 1
					t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor

					if t.colour == Red {
						t.readyForDirectionChange = true
						numberTrafficlightsChangedAxis = numberTrafficlightsChangedAxis + 1
						t.numberTrafficlightsChangedAxis <- numberTrafficlightsChangedAxis
					} else {
						t.readyForDirectionChange = false
						t.numberTrafficlightsChangedAxis <- 0
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
			t.numberTrafficlightsChangedColor <- numberTrafficlightsChangedColor
			t.numberTrafficlightsChangedAxis <- numberTrafficlightsChangedAxis
			t.axisShown <- axisShown
			t.readyForDirectionChange = false
		}

		if numberTrafficlightsChangedAxis == 2 {
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
	numberTrafficlightsChangedAxis := make(chan int)
	for i := North; i <= West; i++ {
		wg.Add(1)
		trafficLight := TrafficLight{
			direction:                       i,
			colour:                          Red,
			activeAxis:                      activeAxis,
			trafficLightShown:               false,
			numberTrafficlightsChangedColor: numberTrafficlightsChangedColor,
			axisShown:                       axisShown,
			numberTrafficlightsChangedAxis:  numberTrafficlightsChangedAxis,
			readyForDirectionChange:         false,
		}
		go trafficLight.Run(&wg)
	}

	go func() {
		numberTrafficlightsChangedColor <- 0
		numberTrafficlightsChangedAxis <- 0
		axisShown <- false
		activeAxis <- NorthSouth
	}()
	wg.Wait()
}

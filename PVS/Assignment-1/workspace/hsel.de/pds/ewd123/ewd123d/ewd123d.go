/*
 * ewd123d.go
 *
 * A program to represent the fourth mutex strategy, as described in EWD123.
 *
 * Copyright (c) 2019-2022 HS Emden/Leer
 * All Rights Reserved.
 *
 * version 2.00 - 30 Oct 2022 - GJV - transform into workspace version
 * version 1.00 - 21 Oct 2019 - GJV - initial version
 *
 * author: Gert Veltink, gert.veltink@hs-emden-leer.de (GJV)
 */

package ewd123d

// global synchronization variables
var c1, c2 = 1, 1

// Start starts the execution of EWD123d.
func Start() {
	go process1()
	go process2()
}

// process1 simulates the behaviour of the first process
func process1() {
	// TO DO
}

// process2 simulates the behaviour of the second process
func process2() {
	// TO DO
}

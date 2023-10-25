/*
 * ewd123c.go
 *
 * A program to represent the third mutex strategy, as described in EWD123.
 *
 * Copyright (c) 2019-2022 HS Emden/Leer
 * All Rights Reserved.
 *
 * version 2.00 - 30 Oct 2022 - GJV - transform into workspace version
 * version 1.00 - 21 Oct 2019 - GJV - initial version
 *
 * author: Gert Veltink, gert.veltink@hs-emden-leer.de (GJV)
 */

package ewd123c

import (
	"log"

	"hsel.de/pds/ewd123/controller"
)

// global synchronization variables
var c1, c2 = 1, 1

// Start starts the execution of EWD123c.
func Start() {
	go process1()
	go process2()
}

// process1 simulates the behaviour of the first process
func process1() {
L1:
	c1 = 0

	controller.OutsideCriticalSection(1, 5000)

	if c2 == 0 {
		log.Printf("Process 1 waiting\n")
		controller.OutsideCriticalSection(1, 50)
		goto L1
	}

	controller.EnterCriticalSection(1)
	controller.InsideCriticalSection(1, 50)
	controller.LeaveCriticalSection(1)

	c1 = 1

	if controller.ProcessCrashed(0.1) {
		log.Printf("Process 1 crashed\n")
		return
	}

	goto L1
}

// process2 simulates the behaviour of the second process
func process2() {
L2:
	c2 = 0

	controller.OutsideCriticalSection(2, 5000)

	if c1 == 0 {
		log.Printf("Process 2 waiting\n")
		controller.OutsideCriticalSection(2, 50)
		goto L2
	}

	controller.EnterCriticalSection(1)
	controller.InsideCriticalSection(1, 50)
	controller.LeaveCriticalSection(1)

	c2 = 1

	if controller.ProcessCrashed(0.1) {
		log.Printf("Process 2 crashed\n")
		return
	}

	goto L2
}

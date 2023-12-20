# Assignment 2: Specifications in mCRL2

## Vending Machine

### Definitions
Zuerst werden die Münzen als `struct` definiert. Es gibt 5, 10, 20, 50 cent Münzen und eine Euro Münze.

```
sort
	Coin = struct _5c | _10c | _20c | _50c | Euro;
```

Es folgt ein Mapping, dass den Münzen ihre jeweiligen Werte zuweist.

```
map
	value: Coin  -> Int;	% the value of a coin as an integer

eqn
	value(_5c) = 5;
	value(_10c) = 10;
	value(_20c) = 20;
	value(_50c) = 50;
	value(Euro) = 100;
```

Das Gleiche findet für die Produkte statt. Diese werden ebenfalls als `struct` definiert und es gibt ein Mapping, was jedem Produkt seinen Kaufwert zuweist.

```
sort
	Product = struct tea | coffee | cake | apple;

map
	price: Product  -> Int;	% the price of a product as an integer

eqn
	price(tea) = 10;
	price(coffee) = 25;
	price(cake) = 60;
	price(apple) = 80;
```

### Vending Machinge Process
Zunächst wird die Vending Machine mit einem Credit von 0 initialisiert.

```
proc
	VendingMachine = VM(0);	

init
    	VendingMachine
;
```

Der `VM` Prozess besteht aus drei Teilen. 

```
VM(credit : Int) =
		(credit < 200) -> sum c:Coin . (accept(c) . VM(credit+value(c)))
		+ sum p:Product . (credit >= price(p)) -> offer(p) . serve(p) . VM(credit - price(p))
		+ ((credit > 0) -> returnChange(credit) . ReturnChange(credit))
	;
```

1. Bis zu einem Credit von 200 können Münzen eingeworfen werden:
```
(credit < 200) -> sum c:Coin . (accept(c) . VM(credit+value(c)))
```

2. Falls der angesammelte Credit ausreicht um Produkte zu kaufen werden diese angeboten und bei Auswahl ausgegeben. Es werden nur Produkte angeboten, die mit dem aktuellen Credit gekauft werden können.

```
sum p:Product . (credit >= price(p)) -> offer(p) . serve(p) . VM(credit - price(p))
```

3. Solange der Credit über 0 ist kann sich das Rückgeld ausgezahlt werde lassen.
```
((credit > 0) -> returnChange(credit) . ReturnChange(credit))
```

Der `ReturnChange` Prozess sorgt dafür, dass das Rückgeld so ausgezahlt wird, dass Münzen von groß nach klein ausgegeben werden. Wenn alle Münzen ausgezahlt wurden startet die Vending Machine wieder mit einem Credit von 0.

```
ReturnChange(credit : Int) = 
		(credit >= value(Euro)) 
		-> return(Euro) . ReturnChange(credit - value(Euro))
    		<> ((credit < value(Euro)) && (credit >= value(_50c))) -> return(_50c) . ReturnChange(credit - value(_50c))
    		<> ((credit < value(_50c)) && (credit >= value(_20c))) -> return(_20c) . ReturnChange(credit - value(_20c))
    		<> ((credit < value(_20c)) && (credit >= value(_10c))) -> return(_10c) . ReturnChange(credit - value(_10c))
    		<> ((credit < value(_10c)) && (credit >= value(_5c))) -> return(_5c) . ReturnChange(credit - value(_5c))
    		<> (credit < value(_5c)) -> tau . VendingMachine
```

## Traffic Lights

### Teilaufgabe 1

```
sort
  CardinalDirection = struct north | east | south | west; % 4 directions
  
sort
	Colour = struct red | green | yellow; % 3 colors which each traffic light can have

map
	next: Colour -> Colour;


eqn
	next(red) = green;
	next(green) = yellow;
	next(yellow) = red;


%------------------------------------------
% definition of a trafficlight
%------------------------------------------
act
  show : CardinalDirection # Colour; % show the color which the given trafficlight currently has

proc
	% shows the current color and change to next color
	TrafficLight(d: CardinalDirection, c: Colour) = show(d, c). TrafficLight(d, next(c));

%-------------------------------------------
% Definition of a system consisting of four trafficlights
init
	TrafficLight(north, red) || TrafficLight(east, red) || TrafficLight(south, red) || TrafficLight(west, red);
```

Zunächst werden die Richtungen der Ampeln und mögliche Farben definiert
```
sort
  CardinalDirection = struct north | east | south | west; % 4 directions
  
sort
	Colour = struct red | green | yellow; % 3 colors which each traffic light can have
```

Es folgt ein Mapping, das definiert in welcher Reihenfolge die Farben durchwechseln können.

```
map
	next: Colour -> Colour;


eqn
	next(red) = green;
	next(green) = yellow;
	next(yellow) = red;
```

Alle Ampeln werden mit Rot initialisiert. Anschließend können alle Ampeln unabhängig voneinander die Farben durchwechseln. Es ist möglich einzelne Ampeln oder beliebig viele gleichzeitig die Farben wechseln zu lassen.

```
act
  show : CardinalDirection # Colour; % show the color which the given trafficlight currently has

proc
	% shows the current color and change to next color
	TrafficLight(d: CardinalDirection, c: Colour) = show(d, c). TrafficLight(d, next(c));

%-------------------------------------------
% Definition of a system consisting of four trafficlights
init
	TrafficLight(north, red) || TrafficLight(east, red) || TrafficLight(south, red) || TrafficLight(west, red);
```

### Teilaufabe 3


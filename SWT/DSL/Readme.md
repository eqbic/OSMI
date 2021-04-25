# Cars - eine mini DSL

## Beschreibung

Diese kleine DSL erleichtert die Konfiguration von Car-Objekten. Es können folgende Eigenschaften gesetzt werden:
- Baujahr
- Farbe
- Marke
- Typ

## Beispiel
```cs
    Car audiCabrio = 
                Car.describedAs
                    .Type(CarType.Cabrio)
                    .Year(2012)
                    .Color(CarColor.Black)
                    .Brand(CarBrand.Audio);
```

Erzeugt folgende Console-Ausgabe:
```console
I am a 2012 Audio Cabrio in Black!
```

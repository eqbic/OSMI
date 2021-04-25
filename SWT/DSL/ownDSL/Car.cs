public class Car
{
    private CarType type;
    private CarBrand brand;
    private CarColor color;
    private int buildYear;
    public static Car describedAs
    {
        get
        {
            return new Car();
        }
    }

    public Car Type(CarType type)
    {
        this.type = type;
        return this;
    }

    public Car Brand(CarBrand brand)
    {
        this.brand = brand;
        return this;
    }

    public Car Color(CarColor color)
    {
        this.color = color;
        return this;
    }
    public Car Year(int year)
    {
        this.buildYear = year;
        return this;
    }

    public override string ToString()
    {
        return $"I am a {buildYear} {brand} {type} in {color}!";
    }
}
public enum CarType
{
    SUV,
    Cabrio,
    Truck,
    Limo,
    Combi,
}

public enum CarColor
{
    Black,
    Blue,
    Silver,
    White,
    Red,
    Green
}
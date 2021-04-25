using System;

namespace DSL
{
    class Program
    {
        static void Main(string[] args)
        {
            Car audiCabrio = 
                Car.describedAs
                    .Type(CarType.Cabrio)
                    .Year(2012)
                    .Color(CarColor.Black)
                    .Brand(CarBrand.Audio);
            Car bmwSuv = 
                Car.describedAs
                    .Brand(CarBrand.BMW)
                    .Type(CarType.SUV)
                    .Year(2019)
                    .Color(CarColor.Silver);


            Console.WriteLine(audiCabrio.ToString());
            Console.WriteLine(bmwSuv.ToString());
        }
    }
}

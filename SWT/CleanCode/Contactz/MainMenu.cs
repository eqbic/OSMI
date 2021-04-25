using System;
using System.Collections.Generic;

namespace Contactz
{
    public class MainMenu : MenuBase
    {
        public MainMenu(Dictionary<Guid, Contact> contacts) : base(contacts)
        {
        }

        public override void Show()
        {
            Console.Clear();
            Console.WriteLine("===== MAIN MENU =====");
            Console.WriteLine("(1) Show Contacts!");
            Console.WriteLine("(2) Add Contact!");
            Console.WriteLine("(Q) Quit!");
            Console.WriteLine();
            Console.WriteLine("Choose an option!");
        }

       
        public override MenuBase SwitchMenu(ConsoleKey input)
        {
            switch (input)
            {
                case ConsoleKey.D1:
                    return new ContactsMenu(contacts);
                case ConsoleKey.D2:
                    return new AddContactMenu(contacts);
                case ConsoleKey.Q:
                    Console.Clear();
                    Environment.Exit(0);
                    return this;
                default:
                    return this;

            }
        }

    }
}
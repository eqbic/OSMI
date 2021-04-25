using System;
using System.Collections.Generic;

namespace Contactz
{
    public class AddContactMenu : MenuBase
    {
        public AddContactMenu(Dictionary<Guid,Contact> contacts) : base(contacts)
        {
        }

        private string firstName;
        private string lastName;
        private string email;
        public override void Show()
        {
            Console.Clear();
            Console.WriteLine("Firstname:");
            firstName = Console.ReadLine();
            Console.WriteLine("Lastname:");
            lastName = Console.ReadLine();
            Console.WriteLine("Email:");
            email = Console.ReadLine();
            Console.WriteLine("Save contact? (y/n)");
        }

        public override MenuBase SwitchMenu(ConsoleKey input)
        {
            switch (input)
            {
                case ConsoleKey.Y:
                    var newContact = new Contact(firstName, lastName, email);
                    contacts.Add(newContact.Id, newContact);
                    return new ContactsMenu(contacts);
                case ConsoleKey.N:
                    return new ContactsMenu(contacts);
                default:
                    return this;
            }
        }
    }
}
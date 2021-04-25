using System;
using System.Collections.Generic;
using System.Linq;

namespace Contactz
{
    public abstract class MenuBase
    {
        protected Dictionary<Guid,Contact> contacts;

        public MenuBase(Dictionary<Guid,Contact> contacts)
        {
            this.contacts = contacts;
        }

        public abstract void Show();
        public abstract MenuBase SwitchMenu(ConsoleKey input);
    }
}
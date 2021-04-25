# Contactz - eine mini Konsolenanwendung

## Beschreibung

Wenn die kleine Konsolenanwendung gestartet wird, werden 5 zufällige Kontakte erzeugt. Diese kann man sich anschauen und auch neue Kontakte hinzufügen. Dabei besteht ein Kontakt nur aus Vor- und Nachname.

## Warum  Clean Code

 **Vermeidung von "Magic Numbers"**

```cs
const int numberOfRandomContacts = 5;
Dictionary<Guid,Contact> contacts = CreateRandomContacts(numberOfRandomContacts);
```

**Kapseln von komplexerer Logik**

```cs
static Dictionary<Guid,Contact> CreateRandomContacts(int numberOfContacts)
        {
            var contacts = new Dictionary<Guid,Contact>();

            Random random = new Random();

            string[] firstNames = { "Max", "Anna", "Maria", "Tim", "Susi", "Alex", "Tino", "Lisa" };
            string[] lastNames = { "Jensen", "Muller", "Obermaier", "Brant", "Stevens", "Doe", "Timmons" };
            
            for (int i = 0; i < numberOfContacts; i++)
            {
                var firstNameIndex = random.Next(firstNames.Length);
                var lastNameIndex = random.Next(lastNames.Length);
                var contact = new Contact(firstNames[firstNameIndex], lastNames[lastNameIndex]);
                contacts.Add(contact.Id, contact);
            }

            return contacts;
        }
```

**Beschreibende Variablennamen**
```cs
const int numberOfRandomContacts = 5;
Dictionary<Guid,Contact> contacts = CreateRandomContacts(numberOfRandomContacts);
```

Introduction
------------
The `BasePlayer` class represents a SA-MP player. This class contains the
methods, properties and events related to players. 

``` cs
public class GameMode : BaseMode
{
    // ...
    protected override void OnPlayerConnected(BasePlayer player, EventArgs e)
    {
        // Always call the base event invocator so the event can propagate.
        base.OnPlayerConnected(player, e);

        player.Money = 1000000;
        player.SendClientMessage($"Welcome, {player.Name}! You are now a millionaire!");
    }
}
```

Subclassing
-----------
In order to allow you to store additional data for the player, SampSharp allows
you to create a subclass of the `BasePlayer` class. In your subclass you can
create properties, fields and methods for storing and consuming your data.
Because you're likely to create a subclass of the player class, SampSharp has
conveniently called it `BasePlayer` instead of `Player` to avoid confusion in
your code.

``` cs
public class Player : BasePlayer
{
    private bool IsCop { get; set; }
    // ...
}
```

Suggestions for ORM
-----------
It is usually a necesity to store your players in a database, so they can register an account, log in etc. For this, you'll most likely opt to use an ORM, such as Entity Framework/EF Core, Dapper, NHibernate etc. to map your local classes to the tables in your database.


Entity Framework Core - Code First
-----------
In order to use Entity Framework Core as your ORM, you will have to install it. Follow the steps provided in the [official EF Core Documentation](https://docs.microsoft.com/en-us/ef/core/get-started/install/) in order to install EF Core. 
After you've installed Entity Framework Core, you will have to add a **Context**.

>_Note:_ We recommend creating a different project inside your solution for database logic, in order to reuse it in things like a UCP Website or a mobile app if needed.

After you've created your context (named `ServerDbContext` in the rest of the tutorial), create a class that will represent what information about your player you want stored in the database (named `PlayerData` in this tutorial).

Sample `PlayerData`:
``` cs
public class PlayerData
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string PasswordHash { get; set; }
    public int PhoneNumber { get; set; }
    //etc.
}
```

Sample context:
``` cs
public class ServerDbContext : DbContext
{
    public DbSet<PlayerData> Players { get; set; }
    
    protected override void OnConfiguring (DbContextOptionsBuilder optionsBuilder)
    { // Configure your connection
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=mydatabase;Trusted_Connection=True;");
            // This is a sample using Microsoft SQL Server. For MySQL, install a provider and use UseMySql instead of SqlServer.
    }
}
```

Afterwards, in your custom subclass of the `BasePlayer` class (named `Player`), add a field for a link with an instance of `PlayerData`

```cs
public class Player : BasePlayer
{
    public PlayerData PlayerData { get; set; }
    // ...
}
```

Once your user logs in, you can set this value to the `PlayerData` instance returned by querying your database for your user's details and then you can proceed to use this in your gamemode.

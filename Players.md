[Introduction](#introduction)

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

TODO: Suggestions for ORM

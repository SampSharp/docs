Introduction
------------
Controllers distribute events between instances and manage the living instances. For example, if the `BaseMode.PlayerEnteredVehicle` event is called, the `BasePlayerController` will trigger the `BasePlayer.EnteredVehicle` event. If a player disconnected, the `BasePlayerController` will destroy the instance of the disconnected player.

Creating Controllers
--------------------
To create a controller, create a class which implements `IController`. There are some additional interfaces which can be implemented to add functionality to the controller:

- If the controller needs to register a type to the [pooling system](pools), it must implement the `ITypeProvider` interface.
- If the controller needs to register [services](services) to the game mode, it must  implement the `IGameServiceProvider` interface.
- If the controller needs to listen to events in the game mode, it must implement the `IEventListener` interface.

``` c#
class MyController : IController, IEventListener, ITypeProvider, IGameServiceProvider
{
    public virtual void RegisterEvents(BaseMode gameMode)
    {
        // TODO: Register your events
    }

    public virtual void RegisterTypes()
    {
        // TODO: Register your types
    }

    public virtual void RegisterServices(BaseMode gameMode, GameModeServiceContainer serviceContainer)
    {
        // TODO: Register your services
    }
}
```

Loading Controllers
-------------------
To load a controller, override `LoadControllers` in your game mode and add them to the controllers collection.

``` c#
protected override void LoadControllers(ControllerCollection controllers)
{
    // Load the default controllers first
    base.LoadControllers(controllers);
            
    controllers.Add(new MyController());
}
```

Overloading Controllers
-----------------------
To overload a controller, create a subclass of the controllers you are overloading and add it to the controllers collection using the `ControllerCollection.Override` method.

``` c#
class MyPlayerController : BasePlayerController
{
    public override void RegisterTypes()
    {
        // Register your own player implementation instead of the default.
        MyPlayer.Register<MyPlayer>();
    }
}

protected override void LoadControllers(ControllerCollection controllers)
{
    // Load the default controllers first
    base.LoadControllers(controllers);
    
    // Override default controllers
    controllers.Override(new MyPlayerController());

    // Add you own controllers
    controllers.Add(new MyController());
}
```
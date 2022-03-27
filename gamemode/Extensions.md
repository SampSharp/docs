Introduction
------------
Extensions are libraries (separate from game modes) which provide additional functionality to the framework, for example, by wrapping around the natives and callbacks of a plugin.

Entry Point
-----------
An extension can define one or more entry points. These entry points must implement `IExtension`.

``` c#
// Extension implements every method in IExtension virtually. This way you can override just the methods you need.
public class ExampleExtension : Extension
{
    #region Overrides of Extension

    public override void PostLoad(BaseMode gameMode)
    {
        Console.WriteLine("ExampleExtension was loaded!");
    }

    #endregion
}
```

The `IExtension` interface contains three methods:

- `LoadServices`: within this method you can load all [services](services) provided by the extension
- `LoadControllers`: within this method you can load all [controllers](controllers) provided by this extension
- `PostLoad`: perform additional actions after all extensions, services and controllers have been loaded

Registration
------------
Extensions can either be manually or automatically registered to the framework. Once registered, [native delegates](natives#native-delegates) within the library of the extension will be loaded and callbacks within the extension class will be handled.

### Automatic Registration
You can let the framework automatically load your extension by attaching the `SampSharpExtension` attribute to the assembly. SampSharp will automatically scan every referenced assembly and check for this attribute. With the `SampSharpExtension` attribute you can specify the [entry point](#entry-point) and extension dependencies by specifying a type within the dependency assembly. Dependencies can, for example, be useful when your service loader requires another service to be loaded already.

``` c#
[assembly: SampSharpExtension(typeof (MyExtension), typeof (TypeInDependencyA), typeof (TypeInDependencyB))]
```

If no entry point is specified, the native delegates within the assembly will be loaded, but the extension won't be registered.

``` c#
[assembly: SampSharpExtension(null)]
```

### Manual Registration
A user can manually register an extension by calling `Extension.Register` with an instance of the extension entry point. Notice that when using manual registration, dependencies of the extension are not taken into consideration.

``` c#
Extension.Register(new MyExtension());
```

Callbacks
---------
Handling callbacks within an extension works the same as handling them within a game mode, but instead of placing the methods in the game mode, they can be placed within the entry point of the extension. For more information on callback handling, see [callbacks](callbacks).
---
title: Natives
---

## Introduction
Though SampSharp provides access to nearly all available SA-MP natives through various wrapper types, there are still situations where you might want to call a native which SampSharp does not provide a wrapper for. In these cases you can write your own wrapper for the native function. Writing wrappers is trivial, all you need to do is create a class which contains the signatures of the natives you want to write the wrapper for.

If you come across a SA-MP native which is not available in SampSharp, please [raise an issue in the SampSharp repository](https://github.com/ikkentim/SampSharp/issues) so we can take a look at it. Please note we don't provide wrappers for natives which provide functionality which can be performed within .NET, such as string or time operations.

The following example provides a wrapper for the `SendClientMessageToAll` native function. Please note the natives used in this article are just examples. All SA-MP natives used in this article are already available through SampSharp.

``` c#
public class MyCustomNatives
{
    [NativeMethod]
    public virtual int SendClientMessageToAll(int color, string message)
    {
        throw new NativeNotImplementedException();
    }
}

// In order to use the native you'll need to create an instance of the wrapper:
var instance = NativeObjectProxyFactory.CreateInstance<MyCustomNatives>();

instance.SendClientMessageToAll(-1, "Hello, world!");
```

## Proxy Creation
When you call `NativeObjectProxyFactory.CreateInstance`, SampSharp compiles a proxy type at runtime and creates an instance of it. Subsequent calls with the same type will re-use the previously compiled type. The proxy type will override all __virtual__ methods decorated with the `NativeMethod` attribute. If the native function could not be found in the SA-MP server, the function is not overridden. This means that the base implementation will be called instead. Generally you want to throw a `NativeNotImplementedException` in the base implementation so you will know when the native function failed to be called. SampSharp also provides a simple base class you can use for your native signature types which provides a singleton instance for your proxy.

``` c#
public class MyCustomNatives : NativeObjectSingleton<MyCustomNatives>
{
    [NativeMethod]
    public virtual int SendClientMessageToAll(int color, string message)
    {
        throw new NativeNotImplementedException();
    }
}

// An instance of the proxy is available through a static property in the type
MyCustomNatives.Instance.SendClientMessageToAll(-1, "Hello, world!");
```

## Native Function Signature
A number of attributes and properties are available to make it completely clear what SampSharp should expect from a native function and how SampSharp should create the proxy method. By default, SampSharp assumes the native function's name is the same as the method name which declares the native. If this is not the true, you can explicitly specify the name of the native function using the `Function` property of the `NativeMethod` attribute.

``` c#
[NativeMethod(Function = "SendClientMessageToAll")]
public virtual int MyMethod(int color, string message)
{
    throw new NativeNotImplementedException();
}
```

### Variable arguments
Certain native functions allow a variable number of arguments. In pawn this is denoted with `{_}:...`, `{Float,_}:...` or with more types:

``` pawn
native CallRemoteFunction(const function[], const format[], {Float,_}:...);
```

SampSharp provides 2 ways of wrapping these functions: Using the `params` keyword or by explicitly specifying the arguments of method.

The [`params` keyword](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/params) in C# permits the method to accept a variable number of arguments. Please note the parameter marked with the `params` keyword must be of type `object[]` in order for SampSharp to properly wrap the values.

``` c#
[NativeMethod]
public virtual int CallRemoteFunction(string function, string format, params object[] args)
{
    throw new NativeNotImplementedException();
}
```

The second option is to explicitly specify the parameter types. This is generally less useful, but there might be situations where this is more fitting. Please note you have to mark the indices of the parameters as "by reference" because variable arguments in pawn are internally passed as references.

``` c#
[NativeMethod(ReferenceIndices = new int[] { 2, 3 })]
public virtual int CallRemoteFunction(string function, string format, int arg1, int 2)
{
    throw new NativeNotImplementedException();
}
```

### Properties
SampSharp can also wrap the getters and setters of properties. SampSharp will generate a getter and setter proxy for every __virtual__ property marked with the `NativeProperty` attribute. By default, SampSharp will assume the native function's name is the same as the property name prepended with `Get` or `Set` (e.g. `GetPlayerMoney` for a the getter of the `PlayerMoney` property). If this is not true, you can explicitly specify the names of the native functions using the `SetFunction` and `GetFunction` property of the `NativeProperty` attribute.

``` c#
[NativeProperty]
public virtual int MaxPlayers
{
    get => throw new NativeNotImplementedException();
}
```

## Array lengths
For arguments of type `int[]`, `bool[]` `float[]`, `out int[]`, `out bool[]`, `out float[]` and `out string` SampSharp needs to know at which parameter index the length of the array (or string buffer) is specified. By default SampSharp assumes the next `int` parameter contains the length of the the array.

For the native function `GetPlayerName` SampSharp will need to know the buffer length of the `name` parameter at index 1. SampSharp will assume the length is located at index 2. When multiple consecutive parameters require a length parameter, the next unused `int` parameter will be used by default. For the native function `ExampleNative` SampSharp will need to know the array length of the parameters `worlds`, `interiors` and `players` at indices 0, 1, and 2. SampSharp will assume the lengths are located at indices 3, 4 and 5.

``` pawn
native GetPlayerName(playerid, name[], len);

native ExampleNative(const worlds[] = { -1 }, const interiors[] = { -1 }, const players[] = { -1 }, maxworlds = sizeof worlds, maxinteriors = sizeof interiors, maxplayers = sizeof players);
```

``` c#
[NativeMethod]
public virtual int GetPlayerName(int playerid, out string name, int length)
{
    throw new NativeNotImplementedException();
}

[NativeMethod]
public virtual int ExampleNative(int[] worlds, int[] interiors, int[] players, int maxworlds, int maxinteriors, int maxplayers)
{
    throw new NativeNotImplementedException();
}
```

When SampSharp's assumptions aren't correct, you can manually specify the indices of the length parameters using the `lengths` argument of the `NativeMethod` attribute.  
In the following example the `CreateDynamicPolygon` native function has an array at index 0, in the attribute we can specify that the length of this array can be found at index 3.

``` pawn
native CreateDynamicPolygon(const Float:points[], Float:minz, Float:maxz, maxpoints = sizeof points, worldid = -1, interiorid = -1, playerid = -1, priority = 0);
```

``` c#
[NativeMethod(3)]
public virtual int CreateDynamicPolygon(float[] points, float minz, float maxz, int maxpoints, int worldid, int interiorid, int playerid, int priority)
{
    throw new NativeNotImplementedException();
}
```

## Identifiers
SampSharp can automatically inject identifier values into all native function calls within a class. This can be useful when you want the native proxy object to represent an instance of an entity. Using the `NativeObjectIdentifiers` attribute you can specify the names of the properties from which the identifiers can be retrieved.
``` c#
[NativeObjectIdentifiers("Id")]
public class Player
{
    public Player(int id)
    {
        Id = id;
    }

    public int Id { get; }

    [NativeProperty]
    public virtual int PlayerMoney 
    {
        get => throw new NativeNotImplementedException();
    }
    
    [NativeMethod]
    public virtual void SendClientMessage(int color, string message)
    {
        throw new NativeNotImplementedException();
    }
}
```

By default the identifiers are prepended to the arguments of all native function calls. Using the `IdentifiersIndex` property of the `NativeMethod` attribute you can indicate the identifiers should be inserted at a different position of the arguments.

``` c#
[NativeObjectIdentifiers("Id")]
public class TextDraw
{
    public TextDraw(int id)
    {
        Id = id;
    }

    public int Id { get; }

    // (...)

    [NativeMethod(Function = "TextDrawShowForPlayer", IdentifiersIndex = 1)]
    public virtual void ShowForPlayer(int playerId)
    {
        throw new NativeNotImplementedException();
    }

    // signature: native TextDrawShowForPlayer(playerid, Text:text);
}
```

If you want to exclude the identifiers for a single property or method within a class which has a `NativeObjectIdentifiers` attribute, you can set the `IgnoreIdentifiers` property of the `NativeMethod` or `NativeProperty` attribute to true.

``` c#
[NativeObjectIdentifiers("Id")]
public class Player
{
    // (...)

    [NativeProperty(ignoreIdentifiers: true)]
    public virtual int MaxPlayers
    {
        get => throw new NativeNotImplementedException();
    }

    [NativeMethod(ignoreIdentifiers: true)]
    public virtual void SendClientMessageToAll(int color, string message)
    {
        throw new NativeNotImplementedException();
    }
}
```
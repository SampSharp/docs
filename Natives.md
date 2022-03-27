Introduction
------------
The framework has plenty of options to interact with native functions. Natives can either be called via static delegate fields (which is much the easiest way of doing it) or via a `NativeLoader.Load`/`INative.Invoke` call.

**Notice!** Most of the natives provided by SA-MP are available via the classes available within the framework. Some natives (mostly the math related ones) are not implemented because it is much easier to use the comparable methods provided by the .NET framework. If you still come across a not implemented native, [send an issue](https://github.com/ikkentim/SampSharp/issues).

Static delegate fields
------------
``` c#
public class MyCustomNatives : NativeObjectSingleton<MyCustomNatives>
{
    [NativeMethod]
    public virtual int SendClientMessageToAll(int color, string message)
    {
        throw new NativeNotImplementedException();
    }
}

public class SomeClass
{
    public static void SendClientMessageToAll()
    {
        MyCustomNatives.Instance.SendClientMessageToAll(-1, "An exemplary message.");
    }
}
```

Loading a Native
----------------
You can load a native by calling `NativeLoader.Load` and specifying the name and parameter types of the function. If the native exists `NativeLoader.Load` returns an instance of type `INative`, otherwise null is returned. A native can be invoked by calling `INative.Invoke`. As parameters you can specify an array of arguments. Because the `args` parameter is marked with the `params` keyword, you can simply input multiple arguments, as shown in the `SendClientMessageToAll` below.

``` c#
// native SendClientMessageToAll(color, const message[]);
INative native = new NativeLoader(BaseMode.Instance.Client).Load("SendClientMessageToAll", null, new Type[] { typeof(int), typeof(string) });
var args = new object[] {0xffffffff, "An exemplary message."};
native.Invoke(args);
```

If an argument if of a output type, you can simply pass null in the arguments array. The value will be set after the `INative.Invoke` is called.

``` c#
// native GetPlayerName(playerid, const name[], len);
INative native = new NativeLoader(BaseMode.Instance.Client).Load("GetPlayerName", null, new Type[] { typeof(int), typeof(string).MakeByRefType(), typeof(int) });
var args = new object[] {0, null, 32};
native.Invoke(args);
string name = args[1] as string;

Console.WriteLine("Name: {0}", name);
```

Existence Check
---------------
To check if a native exists, simply call `NativeLoader.Exists` with the name of the native. This can for example be used to check if a certain plugin is loaded.

``` c#
if(!new NativeLoader(BaseMode.Instance.Client).Exists("Streamer_Update"))
{
    Console.WriteLine("Streamer was not loaded!");
}
```

Length Specifiers
-----------------
If a native has an output argument of type `string`, `int[]`, `float[]` or `bool[]` or an input argument of type `int[]`, `float[]` or `bool[]` the framework needs to know at which parameter index the length of the argument is specified. If you don't specify these indices, the framework will assume the size is specified in the next parameter.

``` c#
// native SomeNative(indices[], Float:points[], indicesCount, pointsCount);
INative native = new NativeLoader(BaseMode.Instance.Client).Load("SomeNative", new[] {2, 3}, new Type[] { typeof(int[]), typeof(float[]), typeof(int) });
```
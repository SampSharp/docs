Introduction
------------
Though SampSharp provides access to nearly all available SA-MP natives through various wrapper types, there are still situations where you might want to call a native which SampSharp does not provide a wrapper for. In these cases you can write your own wrapper for the native function. Writing wrappers is trivial, all you need to do is create a class which contains the signatures of the natives you want to write the wrapper for.

If you come across a SA-MP native which is not available in SampSharp, please [raise an issue in the SampSharp repository](https://github.com/ikkentim/SampSharp/issues) so we can take a look at it. Please note we don't provide wrappers for natives which provide functionality which can be performed within .NET, such as string or time operations.

The following example provides a wrapper for the `SendClientMessageToAll` native function. Please note the natives used in this article are just examples. All SA-MP natives used in this article are already available through SampSharp.

``` c#
public class MyCustomNatives
{
    [NativeMethod]
    public virtual int SendClientMessageToAll(int color, string message) => throw new NativeNotImplementedException();
}

// In order to use the native you'll need to create an instance of the wrapper:
var instance = NativeObjectProxyFactory.CreateInstance<MyCustomNatives>();

instance.SendClientMessageToAll(-1, "Hello, world!");
```

Proxy creation
--------------
When you call `NativeObjectProxyFactory.CreateInstance`, SampSharp compiles a proxy type at runtime and creates an instance of it. Subsequent calls with the same type will re-use the previously compiled type. The proxy type will override all __`virtual`__ methods decorated with the `NativeMethod` attribute. If the native function could not be found in the SA-MP server, the function is not overridden. This means that the base implementation will be called instead. Generally you want to throw a `NativeNotImplementedException` in the base implementation so you will know when the native function failed to be called. SampSharp also provides a simple base class you can use for your native signature types which provides a singleton instance for your proxy.

``` c#
public class MyCustomNatives : NativeObjectSingleton<MyCustomNatives>
{
    [NativeMethod]
    public virtual int SendClientMessageToAll(int color, string message) => throw new NativeNotImplementedException();
}

// An instance of the proxy is available through a static property in the type
MyCustomNatives.Instance.SendClientMessageToAll(-1, "Hello, world!");
```

Native Signature
----------------
A number of attributes and properties are available to make it completely clear what SampSharp should expect from a native function and how SampSharp should create the proxy method. By default, SampSharp assumes the native function's name is the same as the method name which declares the native. If this is not the true, you can explicitly specify the name of the native function using the `Function` property of the `NativeMethod` attribute.

``` c#
[NativeMethod(Function = "SendClientMessageToAll")]
public virtual int MyMethod(int color, string message) => throw new NativeNotImplementedException();
```

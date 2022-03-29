Introduction
------------
SampSharp provides an easy-to-use system for catching callbacks. When a callback is called, SampSharp automatically checks for a method with the same name within the game mode and every loaded extension.

**Notice!** Callbacks provided by SA-MP are all handled by the framework by default. This documentation can be used for handling custom callbacks and callbacks provided by various plugins.

Handling Calls
--------------
To handle calls to callbacks, you simply add a method with the same name within the game mode(or extension). The callback method can be of any access level and must return either an `int`, `bool` or `void`.

``` c#
class GameMode : BaseMode
{
    [Callback]
    internal bool ACustomCallback()
    {
        // Handle the call
        return true;
    }
}
```

Handling Parameters
-------------------
Parameters can simply be specified within the signature of the callback method. Supported parameter types are `int`, `float`, `bool`, `string`, `int[]`, `float[]` and `bool[]`.

``` c#
class GameMode : BaseMode
{
    [Callback]
    internal void ACustomCallback(int parameterA, bool parameterB)
    {
        // Handle the call
    }
}
```

Parameters of an array type *must* specify the 0-based parameter index at which the length of the array is specified. Callbacks which don't specify the size of arrays within a parameter are not supported at the moment.

``` c#
class GameMode : BaseMode
{
    [Callback]
    // The length of `points` is specified in `pointsLength`. The index of `pointsLength` is 1.
    internal void ACustomCallback([ParameterLength(1)]float[] points, int pointsLength)
    {
        // Handle the call
    }
}
```

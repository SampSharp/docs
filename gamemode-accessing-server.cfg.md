---
title: Accessing the server.cfg configuration file
---

Introduction
------------
SampSharp provides some functions to access the server.cfg file and read its values.

Reading
-------
You can read the configuration using the `Server.Config.Get` method or by reading the `Server.Config[]` array accessor.

``` c#
Server.Config.Get("enable_some_feature", false) // Read but do not strip spaces at the start and end of the value
Server.Config.Get("enable_some_feature") // Read and strip spaces at the start and end of the value
Server.Config.Get("enable_some_feature", "default_value", false) // Read but do not strip spaces at the start and end of the value. If no value is set, return "default_value".
Server.Config["enable_some_feature"] // Read and strip spaces at the start and end of the value
```

Writing
-------
You can also write to the configuration array using the `Server.Config.Set` method. Notice the written values will *only* be stored in the current session! When you restart the gamemode the values will be reset to the values found in server.cfg.

``` c#
Server.Config.Set("enable_some_feature", "1");
```
- [Converting Incongnito's Streamer Objects](#converting-incongnitos-streamer-objects)

Converting Incongnito's Streamer Objects
----------------------------------------

If you want to convert map object use the following as a custom output format on [http://www.convertffs.com/](http://www.convertffs.com/):

``` C#
new GlobalObject({model}, new Vector3({x}f, {y}f, {z}f), new Vector3({rx}f, {ry}f, {rz}f));
```

**Example input:**

``` C
CreateDynamicObject(1682, 151.22223, -14.46257, 16.90613,   0.00000, 0.00000, -148.67996);
```

**Example output:**

``` C#
new GlobalObject(1682, new Vector3(151.2222300f, -14.4625700f, 16.9061300f), new Vector3(0.0000000f, 0.0000000f, -148.6799600f));
```
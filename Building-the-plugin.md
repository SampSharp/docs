- [Windows](#windows)
- [Linux](#linux)

Windows
-------
Precompiled binaries of latest stable version of the plugin are available on the [releases](https://github.com/ikkentim/SampSharp/releases) page.

- Download visual studio (if you haven't already)
- Open ```src/SampSharp.sln```
- In the toolbar select ``Debug``  or ```Release```
- In the Solution Explorer, right click on ```SampSharp > build.```
- If you build in Debug mode, the library will be stored in ```env/plugins``` . If you build in ```Release```  mode, the library will be stored in ```bin```.

Linux
-----
*The following guide is written specifically for Ubuntu, you might need to use some different commands for other linux distributions*

- Install premake4, g++ and mono: ```sudo apt-get install premake4 g++ make mono-complete```
- Change to the directory ```src/SampSharp```
- Build the makefiles: ```premake4 gmake```
- Build the plugin: ```make``` (builds in debug mode) -or- ```make config=release32``` (builds in release mode).
- If you build in debug mode, the library will be stored in ```environment/plugins```. If you build in release mode, the library wil be stored in ```bin```.

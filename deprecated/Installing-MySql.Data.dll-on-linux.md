*The instructions on [MySql's website](http://dev.mysql.com/doc/connector-net/en/connector-net-installation-unix.html) are a little outdated, so here are a more complete set of instructions:*

- Make sure you've got mono installed already. (type ```mono --version``` to check if it's installed and to see your current version)
- Download and extract the latest mysql-connector-net-(version)-noinstall.zip from http://dev.mysql.com/downloads/connector/net/ (select Platform: .NET & Mono)
- Locate MySql.Data.dll for .NET 4.5 and change to it's directory. (usually in /v4.5/)
- Add the library to the GAC using ```gacutil /i MySql.Data.dll```.
- Open up the following file with a texteditor (mono-directory)/4.5/machine.config (usually /etc/mono/4.5/machine.config).
- Locate the section ```<system.data>```.
- Inside ```<DbProviderFactories>```, add the following. If you have a MySql Connector/Net version other than 6.9.4.0, change the ```Version``` field accordingly.

``` xml
<add name="MySQL Data Provider" invariant="MySql.Data.MySqlClient"
                 description=".Net Framework Data Provider for MySQL"
                 type="MySql.Data.MySqlClient.MySqlClientFactory, MySql.Data, Version=6.9.4.0, Culture=neutral, PublicKeyToken=c5687fc88969c44d" />
```

[![Analytics](https://ga-beacon.appspot.com/UA-58691640-2/SampSharp/wiki.installing.mysql.linux?pixel)](https://github.com/igrigorik/ga-beacon)
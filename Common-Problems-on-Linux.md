You might run into some errors while running SampSharp on Linux for the first
time. A list of known errors and solutions can be found.

No usable version of the libssl was found
---
- *Error*: No usable version of the libssl was found
- *Solution*: Install the 32-bit version of libssl: (ubuntu) `sudo apt-get install libssl1.0.0:i386` or `sudo apt-get install libssl1.1:i386`

FailFast: Couldn't find a valid ICU package installed on the system
---
- *Error*: FailFast: Couldn't find a valid ICU package installed on the system. Set the configuration flag System.Globalization.Invariant to true if you want to run with no globalization support.
- *Solution*: Install the 32-bit version of libicu: (ubuntu) `sudo apt-get install  libicu-dev:i386`

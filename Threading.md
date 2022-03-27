Introduction
----
SampSharp allows you to use [asynchronous programming](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/) using C#s async-await. SA-MP only allows calls to natives on the main thread. SampSharp will make sure that all calls are sent on the main thread. If a call to a SA-MP native is made on a different thread, SampSharp will wait for the next SA-MP server tick and call the native from that tick. There are a few concepts you need to know about before you start depending heavily on asynchronous programming.

Callbacks
---
All callbacks (events) are called on the main thread. Like for game modes written in Pawn, this means that the SA-MP server will wait for the callback handing to be completed before the server continues handing other events. 

Some callbacks can handle return values, like `OnRconCommand` of which the return value can be set through the `rconEventArgs.Success` property. When you asynchronously await an operation, the execution of the callbacks will continue and the default return value will be returned from the callback because the main thread will not wait for asynchronous operations to complete..

Synchronization Context
---
In SampSharp, all code which comes after an await operation will also run on the main thread, assuming the await operation was started on the main thread. The continuation of code on the main thread is handled by SampSharp's [SynchronizationContext](https://docs.microsoft.com/en-us/archive/msdn-magazine/2011/february/msdn-magazine-parallel-computing-it-s-all-about-the-synchronizationcontext). The SynchronizationContext will run executing the continuation of the code on the next server tick.

Calling Natives from Other Threads
---
SA-MP natives can be safely called from other threads, because SampSharp will wait for the next SA-MP server tick and call the native from that tick. The calling thread will be actively waiting for the next tick. Any consecutive calls to natives will also be waiting for the next server tick. This means that if a method which isn't running on the main thread is making a large number of calls to natives, the execution will be slow because it will be waiting for server ticks a lot. It would be better to run this method on the main thread.
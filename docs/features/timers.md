---
title: Timers
uid: timers
---

# Timers and Scheduling

Timers allow you to schedule tasks to execute at regular intervals or after a specific delay. SampSharp provides two approaches: the `[Timer]` attribute for simple repeating timers, and `ITimerService` for more advanced scenarios requiring manual control.

## Simple Timers with [Timer] Attribute

The simplest way to create a repeating timer is using the `[Timer]` attribute on a method in your system. Specify the interval in milliseconds:

```csharp
public class GameSystem : ISystem
{
    [Timer(1000)] // Interval in milliseconds (1 second)
    public void OnGameTick()
    {
        Console.WriteLine("Game tick!");
    }

    [Timer(100)] // 10 times per second
    public void OnFastUpdate()
    {
        // High-frequency updates
    }
}
```

The timer automatically starts when the system is initialized and runs at the specified interval. This approach is ideal for fire-and-forget timers without manual lifecycle management.

## Advanced Timer Control with ITimerService

For more complex scenarios, use `ITimerService` to have full control over timer creation, stopping, and lifecycle. Both `Start` and `Delay` return a `TimerReference` that you can use to cancel the timer:

```csharp
[Event]
public void OnGameModeInit(ITimerService timerService)
{
    // Repeating timer: runs every 1 second
    var repeatTimer = timerService.Start(serviceProvider =>
    {
        Console.WriteLine("Timer tick!");
    }, TimeSpan.FromSeconds(1));

    // One-time timer: runs once after 5 seconds
    var delayTimer = timerService.Delay(serviceProvider =>
    {
        Console.WriteLine("Delayed action executed");
    }, TimeSpan.FromSeconds(5));
}
```

### Canceling Timers

To stop a running timer, pass its `TimerReference` to `timerService.Stop()`:

```csharp
public class MySystem : ISystem
{
    private TimerReference? _timer;

    [Event]
    public void OnGameModeInit(ITimerService timerService)
    {
        _timer = timerService.Start(serviceProvider =>
        {
            Console.WriteLine("Timer is running");
        }, TimeSpan.FromSeconds(2));
    }

    public void StopTimer(ITimerService timerService)
    {
        if (_timer != null)
        {
            timerService.Stop(_timer);
            _timer = null;
        }
    }
}
```

You can also check a timer's state using `TimerReference.IsActive` and `TimerReference.NextTick` to see when the next execution is scheduled.

### Accessing Services in Timer Actions

Timer actions receive an `IServiceProvider` parameter, allowing you to access services without storing them as fields:

```csharp
timerService.Start(serviceProvider =>
{
    var worldService = serviceProvider.GetRequiredService<IWorldService>();
    // Use worldService within the timer action
}, TimeSpan.FromSeconds(1));
```

This is useful for keeping timers self-contained without field dependencies.

### One-Time Delays

Use `Delay` for one-time scheduled tasks without keeping references:

```csharp
timerService.Delay(serviceProvider =>
{
    Console.WriteLine("This runs once after a delay");
}, TimeSpan.FromSeconds(10));
```

## When to Use Each Approach

- **[Timer] attribute** — Simple, recurring timers with fixed intervals; fire-and-forget
- **ITimerService** — Manual control needed; dynamic intervals; one-time delays; conditional stopping

See <xref:SampSharp.Entities.ITimerService> for the complete API.

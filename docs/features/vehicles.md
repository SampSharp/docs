---
title: Vehicles
uid: vehicles
---

# Vehicles

Vehicles are dynamic entities in SampSharp that can be created, configured, and controlled at runtime. This article covers how to spawn vehicles, handle vehicle-related events, and manipulate vehicles using the `Vehicle` component.

## Spawning a Vehicle

To create (spawn) a vehicle in the world, use the `IWorldService.CreateVehicle` method. This method allows you to specify the vehicle model, position, rotation, colors, respawn delay, and more.

**Example: Spawning a vehicle**

```csharp
public void OnGameModeInit(IWorldService worldService)
{
    var vehicle = worldService.CreateVehicle(
        VehicleModelType.Infernus,
        new Vector3(1500, -1500, 14), // position
        90f,                          // rotation (degrees)
        color1: -1,                   // -1 = random primary color
        color2: -1,                   // -1 = random secondary color
        respawnDelay: 60              // seconds without a driver before respawn; -1 disables respawn
    );
}
```

A few parameter notes worth knowing:

- Pass `-1` for `color1` / `color2` to get a random color.
- `respawnDelay` is in seconds; pass `-1` to disable automatic respawn entirely.
- `addSiren` only has an effect on vehicle models that already have a horn.

See <xref:SampSharp.Entities.SAMP.IWorldService> for all available parameters.

### Static vehicles

<xref:SampSharp.Entities.SAMP.IWorldService.CreateStaticVehicle*> creates a vehicle with pre-loaded models, intended for permanent spawn points configured during `OnGameModeInit`. Beyond efficiency, it is also the only way to create train models (537 and 538) — regular `CreateVehicle` cannot spawn trains.

```csharp
worldService.CreateStaticVehicle(
    VehicleModelType.FreightTrain,                // model 537
    new Vector3(1750, -1950, 14),
    0f,
    color1: -1, color2: -1);
```

For everything else, use `CreateVehicle` so you can also create vehicles outside of init (mission spawns, garage purchases, etc.).

## Handling Vehicle Events

You can respond to vehicle-related events such as when a vehicle spawns, a player enters or exits a vehicle, and more. Here are some common event handlers:

```csharp
public class VehicleEventSystem : ISystem
{
    [Event]
    public void OnVehicleSpawn(Vehicle vehicle)
    {
        Console.WriteLine($"Vehicle spawned: {vehicle.Model}");
    }

    [Event]
    public void OnPlayerEnterVehicle(Player player, Vehicle vehicle, bool isPassenger)
    {
        Console.WriteLine($"{player} entered vehicle {vehicle.Model}");
    }

    [Event]
    public void OnPlayerExitVehicle(Player player, Vehicle vehicle)
    {
        Console.WriteLine($"{player} exited vehicle {vehicle.Model}");
    }
}
```

For a full list of available vehicle events, see <xref:built-in-events>.

## Manipulating Vehicles

The `Vehicle` component provides many properties and methods to interact with vehicles. Here are some simple examples:

```csharp
// Set the vehicle's health
vehicle.Health = 1000f;

// Change the vehicle's color
vehicle.Colors = (3, 6); // primary: 3, secondary: 6

// Set the vehicle's velocity
vehicle.Velocity = new Vector3(0, 10, 0); // move forward

// Turn on the engine
vehicle.Engine = true;

// Check if the vehicle has a trailer
if (vehicle.HasTrailer)
{
    Console.WriteLine("This vehicle has a trailer attached.");
}
```

See <xref:SampSharp.Entities.SAMP.Vehicle> for all available properties and methods.

## Lifetime

A `Vehicle` component is destroyed when you call `Destroy()` on it, when its parent entity is destroyed, or when the server shuts down. As with any component, holding the reference across an `await` or timer callback can yield a destroyed instance — guard with `if (vehicle)` before use. See [Component liveness](xref:entities-components#component-liveness) for the full explanation.

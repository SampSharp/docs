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
        color1: 1,                    // primary color
        color2: 1                     // secondary color
    );
}
```

See <xref:SampSharp.Entities.SAMP.IWorldService> for all available parameters.

## Handling Vehicle Events

You can respond to vehicle-related events such as when a vehicle spawns, a player enters or exits a vehicle, and more. Here are some common event handlers:

```csharp
public class VehicleEventSystem : ISystem
{
	[EventHandler]
	public void OnVehicleSpawn(Vehicle vehicle)
	{
		Console.WriteLine($"Vehicle spawned: {vehicle.Model}");
	}

	[EventHandler]
	public void OnPlayerEnterVehicle(Player player, Vehicle vehicle, bool isPassenger)
	{
		Console.WriteLine($"{player} entered vehicle {vehicle.Model}");
	}

	[EventHandler]
	public void OnPlayerExitVehicle(Player player, Vehicle vehicle)
	{
		Console.WriteLine($"{player} exited vehicle {vehicle.Model}");
	}
}
```

For a full list of available vehicle events, see <xref:events>.

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



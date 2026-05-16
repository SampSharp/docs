---
title: Entity-Component-System
uid: core-concepts
---

# Core Concepts

## Entity-Component-System (ECS)

SampSharp is built on the **Entity-Component-System** (ECS) architecture, a powerful design pattern that separates data from logic and provides a flexible, scalable approach to building game modes. This chapter explains the fundamental concepts you need to understand to work effectively with SampSharp.

### What is ECS?

The Entity-Component-System is an architectural pattern that organizes game objects and their behavior through three key concepts:

1. **Entities** - the objects in your game world
2. **Components** - the data that describes those objects
3. **Systems** - the logic that operates on the data

Rather than using traditional object-oriented inheritance (where a "Player" class inherits from a "Character" class which inherits from a "GameObject"), ECS uses **composition**: you create a base entity and attach components to it to define what it is and what it can do.

### Entities

An **entity** is a unique identifier representing something in your game world. It could be a player, a vehicle, a building, an item, or any other object. 

In SampSharp, entities are extremely lightweight—they're essentially just containers. An entity only has meaning when components are attached to it; an entity without components doesn't exist or serve any purpose in the system.

**Key characteristics:**
- Each entity has a unique ID
- Entities only exist when they have at least one component
- Multiple entities can exist simultaneously
- Entities can be created and destroyed dynamically

> For more information on entities, see <xref:entities-components>.

### Components

A **component** is a container that holds data and functionality related to a specific aspect of an entity. Components are the "nouns" of your system—they describe what properties and capabilities an entity has.

Unlike traditional object-oriented design where you might create a deep inheritance hierarchy (Player → Character → GameObject), ECS uses composition: you create an entity and attach whatever components it needs. This makes it easy to create complex entities by combining simpler pieces.

**Key characteristics:**
- Components hold data and related methods
- An entity can have any combination of components
- You can add or remove components from entities dynamically
- Components can be queried to find entities with specific combinations
- Different components can work together to create complex behaviors

> For more information about components, see <xref:entities-components>.

### Systems

A **system** is the logic layer of ECS. Systems read data from components and perform operations based on that data. A system typically operates on entities that have a specific set of components.

Systems are responsible for implementing all the game logic—they query for entities with the components they care about, then perform operations on that data.

**Key characteristics:**
- Systems contain all the business logic for a particular behavior
- Systems query for entities with specific component combinations
- Systems operate on data without owning it
- Systems are independent and can run in any order
- Logic is decoupled from data storage

> For more information about systems, see <xref:systems>.

### Events

In SampSharp, **events** are notifications that occur when something happens in the open.mp server (like a player connecting, a player request class, or game mode initialization). Systems can handle these events by implementing methods decorated with the `[Event]` attribute.

When an event fires, SampSharp automatically calls your handler method and passes the relevant entity components and services as parameters, allowing your system to react to world changes.

> For more information about events, see <xref:events>.

### How It Works Together

Here's how ECS operates in practice with SampSharp:

**Example - handling a pickup event:**
1. A player picks up an item in the world
2. open.mp fires a pickup event
3. A system receives the event with the `Player` and `Pickup` components
4. The system updates the player's inventory based on the pickup data
5. The system removes the pickup entity

**Example - handling a vehicle event:**
1. A player exits a vehicle
2. open.mp fires a vehicle exit event
3. A system receives the event with the `Player` and `Vehicle` components
4. The system calculates a fare based on distance traveled and gives money to the player
5. The system logs the ride for statistics
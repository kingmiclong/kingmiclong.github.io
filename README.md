# Devlog Entry - [11/19/2023]

## Introducing the team
- Tools Lead: JustInTime
- Engine Lead: MicLong
- Design Lead: NoComp

## Tools and materials
### Engine/Library/Framework: Phaser 3
- **Description:** Phaser 3 is a popular and versatile HTML5 game framework for building 2D games using JavaScript.
- **Motivation:** Phaser 3 is easy to use, and has been something we have learned about in previous classes. It is convenient and provides a nice starting point.

### Language: JavaScript with Phaser 3
- **Description:** JavaScript is a widely used programming language for web development. When coupled with Phaser 3, it becomes the primary language for developing your game.
- **Motivation:** JavaScript is a language that we, as a group, are fairly comfortable with. We believe that it will be a good choice for our group.

### Tools: Visual Studio Code
- **Description:** Visual Studio Code (VS Code) is a lightweight yet powerful source code editor known for its rich features, support for various programming languages, and a vast library of extensions.
- **Motivation:** VS Code seems to be a standard tool that is recommended in all of our coding classes. We figured that it fit perfectly well with this project.

## Outlook
The goal of our team is to add some aspects of realism to our game, that may not be present in other games. We are doing additional research into plant types, which can add some more immersion into our game. I think the hardest part of the project will be managing our scope, which can easily be blown out of proportion in such a short period of time. I hope to learn how to properly document and iterate on our game, while focusing on organization and planning, as well as refactoring.

# Devlog Entry - [11/29/2023]

## How we satisfied the software requirements
- **[F0.a] You control a character moving on a 2D grid:** In order to satisfy this condition, we implemented a tilemap where the player resides. Players are able to use the arrow keys to move around this grid.
- **[F0.b] You advance time in the turn-based simulation manually:** In order to satisfy this condition, we implemented a counter based on player actions. Each turn consists of 10 player actions, with sun/water levels being adjusted at the end of each turn. Plant growth also happens at the beginning of each turn.
- **[F0.c] You can reap (gather) or sow (plant) plants on the grid when your character is near them:]** In order to satisfy this condition, we allowed the user to plant seeds on the grid when they are within the garden areas by using the Q key. After planting, the user can havest the crops when they are fully grown using the W key.
- **[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns:** In order to satisfy this condition, we implemented a formula which calculates a unique sun and water value for each square. The water value is added to the space, while the sun value is used or discarded immediately. Plants that are on these tiles consume sunlight and water.
- **[F0.e] Each plant on the grid has a type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”):** In order to satisfy this condition, we added three different plant types. These consist of Tomato, Potato, and Eggplant. Each plant goes through different stages of growth, from seedling to level 1, 2 and 3.
- **[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions):** In order to satisfy this condition, we added logic so that plants have specific amounts of sunlight and water that they require. Once plants reach certain water and sunlight thresholds, they grow to the next stage.
- **[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above):** In order to satisfy this condition, we keep track of the total amount of T3 plants collected. Once the user has collected enough fully grown plants, they are met with a popup of a job well done.

## Reflection
After working on the F0 requirements, we realized that the scope of some of our additions might need to change. Our initial plans were to add many additional features, but with a smaller team and limited time we realized that some of those features may be too ambitious to balance and implement in a way that is both balanced and satisfying. As far as positions go as a 3 man team, we feel that the current positions are working fine. If we had more people, now might have been the time to think about swapping secondary people to different spots based on what we believe needs the most focus. As far as tools and materials go, the ones we have been using so far have felt good. We are constantly on the lookout for new tools that can improve our workflow, but have yet to find anything extraordinary that needs to be implemented.

# Devlog Entry - [12/6/2023]

## How we satisfied the software requirements
- **[F0.a] You control a character moving on a 2D grid:** same as last week
- **[F0.b] You advance time in the turn-based simulation manually:** same as last week
- **[F0.c] You can reap (gather) or sow (plant) plants on the grid when your character is near them:]** same as last week
- **[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns:** same as last week
- **[F0.e] Each plant on the grid has a type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”):** same as last week
- **[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions):** same as last week
- **[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above):** same as last week
- **[F1.a] The important state of each cell of your game’s grid must be backed by a single contiguous byte array in AoS or SoA format. Your team must statically allocate memory usage for the whole grid:** Our byte array is in AoS form.
**[F1.a data structure diagram](./AoS%20Structure.png)"**
- **[F1.b] The player must be able to undo every major choice (all the way back to the start of play), even from a saved game. They should be able to redo (undo of undo operations) multiple times:** In order to satisfy this condition, we added the ability to undo and redo actions. We use an undo and a redo stack to store actions, which allows the user to cycle back through their gameplay using R to redo actions and T to undo actions.
- **[F1.c] The player must be able to manually save their progress in the game in a way that allows them to load that save and continue play another day. The player must be able to manage multiple save files (allowing save scumming):** In order to satisfy this condition, we added a save and load button. The save button downloads a file that saves the current gamestate, which a user can then access and load using the load button. Players can make as many of these files as they want.
- **[F1.d] The game must implement an implicit auto-save system to support recovery from unexpected quits. (For example, when the game is launched, if an auto-save entry is present, the game might ask the player "do you want to continue where you left off?" The auto-save entry might or might not be visible among the list of manual save entries available for the player to load as part of F1.c.):** In order to satsify this condition, we added an auto-save functionality where the current gamestate is saved every minute. If the game is reloaded, the user is prompted to resume from their previous save if wanted.

## Reflection
After working on the F1 requirements, our goal has shifted slightly. While having design, tool, and engine leads are important, we have reached the point in the process where new issues pop up that are not specifically assigned to one of these roles. For example, bugs become a much bigger issue during rapid development. Shifting our focus away from our "lead" positions and working on different things such as finding and fixing bugs will be a priority going forward, as tools and design are mostly sorted. Now that we have the saving and reversing set up, we are looking at how we can evolve our game further. Players need more feedback, and adding UI elements or other indications of what is going on with the plants seems like a reasonable next step.

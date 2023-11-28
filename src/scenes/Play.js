class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
    this.actionCount = 0;
    this.actionsPerTurn = 10; // Number of actions per turn
    this.currentTurn = 1; // Current turn number
  }

  preload() {
    this.load.path = "./assets/";
    //Load characters
    this.load.atlas("pig", "pig.png", "pig.json");

    //Load plants
    this.load.spritesheet("plants", "plants.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    // Array - Plants
    this.plants = [];

    // Create the tilemap
    const map = this.make.tilemap({ key: "Map" });
    const tileset = map.addTilesetImage("tiles", "tiles");

    // Set the world bounds to match the size of this layer
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Create layers
    this.backGroundLayer = map.createLayer("Background", tileset, 0, 0);
    this.wallsLayer = map.createLayer("Fence", tileset, 0, 0);
    this.dirtLayer = map.createLayer("Dirt", tileset, 0, 0);

    // Set up collisions
    this.wallsLayer.setCollisionByProperty({ collides: true });

    // Create text elements for turn number and action counter with corrected style
    this.turnText = this.add.text(10, 10, "Turn: 1", {
      fontSize: "16px",
      color: "#FFFFFF",
    });
    this.actionText = this.add.text(10, 30, "Actions Left: 10", {
      fontSize: "16px",
      color: "#FFFFFF",
    });

    // Create the pig sprite and add it to the scene
    this.player = this.physics.add.sprite(100, 100, "pig", "pig0.png");
    this.player.setScale(1);

    // Set the player to collide with the world bounds
    this.player.setCollideWorldBounds(true);

    // Add collision between 2 layers
    this.physics.add.collider(this.player, this.wallsLayer);

    // Camera setup to follow the player
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setZoom(1); // Set the desired zoom level

    // Enables Pointer
    gamePointer = this.input.activePointer;

    // Player's animation
    this.createAnimations();

    // Define Keyboard Inputs
    this.cursors = this.input.keyboard.createCursorKeys();

    // Grid size matches tile size in Tiled
    this.gridSize = 16;

    // Prevents diagonal movement and allows for grid-based movement
    this.input.keyboard.on("keydown", this.handleKeyDown, this);
  }

  createAnimations() {
    // pig animation
    this.anims.create({
      key: "walkRight",
      frames: this.anims.generateFrameNames("pig", {
        start: 0,
        end: 2,
        zeroPad: 0,
        prefix: "pig",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walkDown",
      frames: this.anims.generateFrameNames("pig", {
        start: 3,
        end: 5,
        zeroPad: 0,
        prefix: "pig",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walkUp",
      frames: this.anims.generateFrameNames("pig", {
        start: 6,
        end: 8,
        zeroPad: 0,
        prefix: "pig",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walkLeft",
      frames: this.anims.generateFrameNames("pig", {
        start: 9,
        end: 11,
        zeroPad: 0,
        prefix: "pig",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  // Event Handler - Key Pressing
  handleKeyDown(event) {
    if (!this.player.body.velocity.equals(new Phaser.Math.Vector2())) {
      // Skip if already moving
      return;
    }

    let targetX = this.player.x;
    let targetY = this.player.y;

    switch (event.code) {
      case "ArrowLeft":
        targetX -= this.gridSize;
        this.player.anims.play("walkLeft", true);
        break;
      case "ArrowRight":
        targetX += this.gridSize;
        this.player.anims.play("walkRight", true);
        break;
      case "ArrowUp":
        targetY -= this.gridSize;
        this.player.anims.play("walkUp", true);
        break;
      case "ArrowDown":
        targetY += this.gridSize;
        this.player.anims.play("walkDown", true);
        break;
    }

    if (this.canMoveTo(targetX, targetY)) {
      this.tweens.add({
        targets: this.player,
        x: targetX,
        y: targetY,
        ease: "Linear",
        duration: 200, // Duration of the movement in milliseconds
        onComplete: () => {
          this.player.anims.stop(); // Stop animation when movement is complete
          this.actionTaken(); // Call this method when an action is completed
        },
      });
    }

    // Space bar for plant harvest
    if (event.code === "Space") {
      const playerTileX = Math.floor(this.player.x / this.gridSize);
      const playerTileY = Math.floor(this.player.y / this.gridSize);
      const tile = this.dirtLayer.getTileAt(playerTileX, playerTileY);

      if (tile && tile.properties.plantable) {
        // Attempt planting or harvesting only if it's a valid tile
        this.attemptPlantingOrHarvesting();
        this.actionTaken();
      }
      // Do not count as an action if the tile is not plantable
    }
  }

  // Position record
  canMoveTo(x, y) {
    // Check if the new x, y position in the world
    return (
      x >= 0 &&
      x <= this.physics.world.bounds.width &&
      y >= 0 &&
      y <= this.physics.world.bounds.height &&
      !this.wallsLayer.getTileAtWorldXY(x, y)
    );
  }

  // Action counting
  actionTaken() {
    this.actionCount++;
    this.actionText.setText(
      "Actions Left: " + (this.actionsPerTurn - this.actionCount)
    );

    if (this.actionCount >= this.actionsPerTurn) {
      this.endTurn();
    }
  }

  // End Turn and update Environment and update Plant
  endTurn() {
    // Increase turn number and reset the action count
    this.currentTurn++;
    this.actionCount = 0;

    // Update text elements
    this.turnText.setText("Turn: " + this.currentTurn);
    this.actionText.setText("Actions Left: " + this.actionsPerTurn);

    // Update game state for the new turn
    this.updateEnvironment();
    this.updatePlants();

    // Log the end of the turn for debugging
    console.log("Turn ended");
  }

  updateEnvironment() {
    // ... logic to update environmental factors ...
  }

  // Plants functions
  plantSeed(tileX, tileY, species) {
    // Convert tile coordinates back to world coordinates for placing the sprite
    const x = tileX * this.gridSize + this.gridSize / 2;
    const y = tileY * this.gridSize + this.gridSize / 2;

    if (!this.getPlantAt(x, y)) {
      const plant = new Plant(this, x, y, species);
      this.plants.push(plant);
    }
  }

  harvestPlant(tileX, tileY) {
    // Convert tile coordinates back to world coordinates for checking the plant
    const x = tileX * this.gridSize + this.gridSize / 2;
    const y = tileY * this.gridSize + this.gridSize / 2;

    const plant = this.getPlantAt(x, y);
    if (plant && plant.isReadyToHarvest) {
      plant.harvest();
      this.plants = this.plants.filter((p) => p !== plant);
      console.log("Harvested a " + plant.species + " at:", tileX, tileY);
    }
  }

  getPlantAt(x, y) {
    return this.plants.find(
      (plant) => plant.sprite.x === x && plant.sprite.y === y
    );
  }

  // Not sure if I can make this call after or before Event handler
  attemptPlantingOrHarvesting() {
    // Convert the player's world position to tile coordinates
    const tileX = this.dirtLayer.worldToTileX(this.player.x);
    const tileY = this.dirtLayer.worldToTileY(this.player.y);

    // Access the tile using tile coordinates
    const tile = this.dirtLayer.getTileAt(tileX, tileY);

    // Log the properties of the tile to the console
    if (tile) {
      console.log(tile.properties);
    }

    // If the tile is plantable and there is no plant there, plant a seed
    if (tile && tile.properties.plantable) {
      const speciesArray = ["potato", "tomato", "eggplant"];
      const randomSpecies = Phaser.Utils.Array.GetRandom(speciesArray);
      this.plantSeed(tileX, tileY, randomSpecies);
      console.log("Planted a " + randomSpecies + " at:", tileX, tileY);
    } else {
      // If there is a plant and it's ready to harvest, harvest it
      const plant = this.getPlantAt(this.player.x, this.player.y);
      if (plant && plant.isReadyToHarvest) {
        plant.harvest();
        console.log("Harvested a plant at:", tileX, tileY);
      }
    }

    // Call this function in your handleKeyDown method when the player presses the 'Space' bar
  }

  updatePlants() {
    this.plants.forEach((plant) => {
      // Logic for when to grow plants, for example, on a new turn
      plant.grow();
    });
  }
}

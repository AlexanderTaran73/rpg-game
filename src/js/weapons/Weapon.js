export default class Weapon {
  constructor(name, attack, durability, range) {
    this.name = name;
    this.attack = attack;
    this.initDurability = durability;
    this.durability = durability;
    this.range = range;
  }

  takeDamage(damage) {
    if (this.durability !== Infinity) {
      this.durability = Math.max(0, this.durability - damage);
    }
  }

  getDamage() {
    if (this.durability <= 0) {
      return 0;
    }
    
    const percent = this.durability / this.initDurability * 100;
    if (percent >= 30 || this.durability == this.initDurability) {
      return this.attack;
    } else {
      return this.attack / 2;
    }
  }

  isBroken() {
    return this.durability === 0;
  }
}

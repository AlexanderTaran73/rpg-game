import Player from './Player';
import Sword from '../weapons/Sword';
import Knife from '../weapons/Knife';
import Arm from '../weapons/Arm';

export default class Warrior extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 120;
    this.speed = 2;
    this.attack = 10;
    this.description = 'Воин';
    this.weapon = new Sword();
    this.baseWeapons = [Sword, Knife, Arm];
  }

  takeDamage(damage) {
    if (this.life <= 60 && this.getLuck() > 0.8) {
      if (this.magic > 0) {
        const magicBefore = this.magic;
        this.magic = Math.max(0, this.magic - damage);
        const magicUsed = magicBefore - this.magic;
        const remainingDamage = damage - magicUsed;
        if (remainingDamage > 0) {
          this.life = Math.max(0, this.life - remainingDamage);
        }
      } else {
        this.life = Math.max(0, this.life - damage);
      }
    } else {
      this.life = Math.max(0, this.life - damage);
    }
  }
}
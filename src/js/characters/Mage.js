import Player from './Player';
import Staff from '../weapons/Staff';
import Knife from '../weapons/Knife';
import Arm from '../weapons/Arm';

export default class Mage extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 70;
    this.magic = 100;
    this.attack = 5;
    this.agility = 8;
    this.description = 'Маг';
    this.weapon = new Staff();
    this.baseWeapons = [Staff, Knife, Arm];
  }

  takeDamage(damage) {
    if (this.magic > 50) {
      const actualDamage = damage / 2;
      this.life = Math.max(0, this.life - actualDamage);
      this.magic = Math.max(0, this.magic - 12);
    } else {
      this.life = Math.max(0, this.life - damage);
    }
  }
}
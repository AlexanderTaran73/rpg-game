import Warrior from './Warrior';
import Axe from '../weapons/Axe';
import Knife from '../weapons/Knife';
import Arm from '../weapons/Arm';

export default class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);
    this.life = 130;
    this.attack = 15;
    this.luck = 20;
    this.description = 'Гном';
    this.weapon = new Axe();
    this.baseWeapons = [Axe, Knife, Arm];
  }

  takeDamage(damage) {
    this.attackCount++;
    if (this.attackCount % 6 === 0 && this.getLuck() > 0.5) {
      super.takeDamage(damage / 2);
    } else {
      super.takeDamage(damage);
    }
  }
}
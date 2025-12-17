import Sword from './Sword.js';

export default class Axe extends Sword {
  constructor() {
    super();
    this.name = 'Секира';
    this.attack = 27;
    this.initDurability = 800;
    this.durability = 800;
  }
}
import Weapon from './Weapon.js';

export default class Bow extends Weapon {
  constructor() {
    super('Лук', 10, 200, 3);
  }
}
import Arm from '../weapons/Arm';
import Knife from '../weapons/Knife';

export default class Player {
  constructor(position, name) {
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();
    this.position = position;
    this.name = name;
    this.attackCount = 0; 
    this.baseWeapons = [];
  }

  getLuck() {
    const randomNumber = Math.random() * 100;
    return (randomNumber + this.luck) / 100;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }
    const weaponDamage = this.weapon.getDamage();
    return (this.attack + weaponDamage) * this.getLuck() / distance;
  }

  takeDamage(damage) {
    this.life = Math.max(0, this.life - damage);
  }

  isDead() {
    return this.life <= 0;
  }

  moveLeft(distance) {
    const moveDistance = Math.min(distance, this.speed);
    this.position -= moveDistance;
  }

  moveRight(distance) {
    const moveDistance = Math.min(distance, this.speed);
    this.position += moveDistance;
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(-distance);
    } else {
      this.moveRight(distance);
    }
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      this.checkWeapon();
    } else if (this.dodged()) {
    } else {
      this.takeDamage(damage);
    }
  }

  checkWeapon() {
    if (this.weapon.isBroken() && this.baseWeapons.length > 0) {
      const currentIndex = this.baseWeapons.findIndex(
        weaponClass => weaponClass.name === this.weapon.constructor.name
      );
      
      if (currentIndex < this.baseWeapons.length - 1) {
        const NextWeaponClass = this.baseWeapons[currentIndex + 1];
        this.weapon = new NextWeaponClass();
      }
    }
  }

  tryAttack(enemy) {
    const distance = Math.abs(this.position - enemy.position);
    
    if (this.weapon.range < distance) {
      return false;
    }

    const wear = 10 * this.getLuck();
    this.weapon.takeDamage(wear);
    this.checkWeapon();

    const damage = this.getDamage(distance);
    enemy.takeAttack(damage);

    if (this.position === enemy.position) {
      enemy.moveRight(1);
      enemy.takeAttack(damage * 2);
    }

    return true;
  }

  chooseEnemy(players) {
    const alivePlayers = players.filter(
      player => player !== this && !player.isDead()
    );

    if (alivePlayers.length === 0) {
      return null;
    }

    return alivePlayers.reduce((minPlayer, player) => 
      player.life < minPlayer.life ? player : minPlayer
    );
  }

  moveToEnemy(enemy) {
    if (!enemy) return;

    const distance = enemy.position - this.position;
    this.move(distance);
  }

  turn(players) {
    const enemy = this.chooseEnemy(players);
    if (enemy) {
      this.moveToEnemy(enemy);
      this.tryAttack(enemy);
    }
  }
}
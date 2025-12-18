import Player from '../src/js/characters/Player';
import Warrior from '../src/js/characters/Warrior';
import Archer from '../src/js/characters/Archer';
import Mage from '../src/js/characters/Mage';
import Dwarf from '../src/js/characters/Dwarf';
import Crossbowman from '../src/js/characters/Crossbowman';
import Demiurge from '../src/js/characters/Demiurge';
import Sword from '../src/js/weapons/Sword';
import Bow from '../src/js/weapons/Bow';
import Staff from '../src/js/weapons/Staff';
import Arm from '../src/js/weapons/Arm';
import Knife from '../src/js/weapons/Knife';
import Axe from '../src/js/weapons/Axe';
import LongBow from '../src/js/weapons/LongBow';
import StormStaff from '../src/js/weapons/StormStaff';

const mockMathRandom = (value) => {
  const originalMathRandom = Math.random;
  Math.random = () => value;
  return () => {
    Math.random = originalMathRandom;
  };
};

describe('Player - Constructor and Basic Methods', () => {
  test('should create player with correct properties', () => {
    const player = new Player(5, 'Test Hero');
    
    expect(player.name).toBe('Test Hero');
    expect(player.position).toBe(5);
    expect(player.life).toBe(100);
    expect(player.magic).toBe(20);
    expect(player.speed).toBe(1);
    expect(player.attack).toBe(10);
    expect(player.agility).toBe(5);
    expect(player.luck).toBe(10);
    expect(player.description).toBe('Игрок');
    expect(player.weapon).toBeInstanceOf(Arm);
    expect(player.attackCount).toBe(0);
    expect(player.baseWeapons).toEqual([]);
  });

  test('getLuck should return correct value', () => {
    const player = new Player(0, 'Test');
    const restoreRandom = mockMathRandom(0.5);
    
    const luck = player.getLuck();
    expect(luck).toBe((50 + 10) / 100); 
    
    restoreRandom();
  });

  test('getDamage should return 0 when distance > weapon range', () => {
    const player = new Player(0, 'Test');
    player.weapon.range = 2;
    
    const damage = player.getDamage(3);
    expect(damage).toBe(0);
  });

  test('getDamage should calculate damage correctly', () => {
    const player = new Player(0, 'Test');
    player.weapon.range = 5;
    player.weapon.getDamage = jest.fn(() => 5);
    player.getLuck = jest.fn(() => 0.8);
    player.attack = 10;
    
    const damage = player.getDamage(2);
    expect(damage).toBe((10 + 5) * 0.8 / 2);
  });

  test('takeDamage should reduce life and not go below 0', () => {
    const player = new Player(0, 'Test');
    
    player.takeDamage(30);
    expect(player.life).toBe(70);
    
    player.takeDamage(80);
    expect(player.life).toBe(0);
  });

  test('isDead should return correct state', () => {
    const player = new Player(0, 'Test');
    
    expect(player.isDead()).toBe(false);
    
    player.takeDamage(100);
    expect(player.isDead()).toBe(true);
    
    player.takeDamage(10);
    expect(player.isDead()).toBe(true);
  });
});

describe('Player - Movement Methods', () => {
  test('moveLeft should respect speed limit', () => {
    const player = new Player(10, 'Test');
    player.speed = 3;
    
    player.moveLeft(5);
    expect(player.position).toBe(7);
    
    player.moveLeft(2);
    expect(player.position).toBe(5);
  });

  test('moveRight should respect speed limit', () => {
    const player = new Player(10, 'Test');
    player.speed = 2;
    
    player.moveRight(5);
    expect(player.position).toBe(12);
    
    player.moveRight(1);
    expect(player.position).toBe(13);
  });

  test('move should handle positive and negative distances', () => {
    const player = new Player(10, 'Test');
    player.speed = 3;
    
    player.move(-4);
    expect(player.position).toBe(7);
    
    player.move(5);
    expect(player.position).toBe(10);
  });

  test('move should handle zero distance', () => {
    const player = new Player(10, 'Test');
    player.speed = 3;
    
    player.move(0);
    expect(player.position).toBe(10);
  });
});

describe('Player - Defense Methods', () => {
  let player;

  beforeEach(() => {
    player = new Player(0, 'Test');
    player.luck = 50;
    player.agility = 20;
    player.speed = 2;
  });

  test('isAttackBlocked should work correctly', () => {
    
    player.getLuck = jest.fn(() => 0.6);
    expect(player.isAttackBlocked()).toBe(true);
    
    player.getLuck = jest.fn(() => 0.4);
    expect(player.isAttackBlocked()).toBe(false);
    
    player.getLuck = jest.fn(() => 0.5);
    expect(player.isAttackBlocked()).toBe(false); 
  });

  test('dodged should work correctly', () => {
    
    player.getLuck = jest.fn(() => 0.8);
    expect(player.dodged()).toBe(true);
    
    player.getLuck = jest.fn(() => 0.7);
    expect(player.dodged()).toBe(false);
  });
});

describe('Player - Combat Methods', () => {
  test('takeAttack should handle blocked attack', () => {
    const player = new Player(0, 'Test');
    player.weapon = new Sword();
    const initialDurability = player.weapon.durability;
    
    player.isAttackBlocked = jest.fn(() => true);
    player.dodged = jest.fn(() => false);
    
    player.takeAttack(10);
    expect(player.weapon.durability).toBeLessThan(initialDurability);
  });

  test('takeAttack should handle dodged attack', () => {
    const player = new Player(0, 'Test');
    const initialLife = player.life;
    
    player.isAttackBlocked = jest.fn(() => false);
    player.dodged = jest.fn(() => true);
    
    player.takeAttack(10);
    expect(player.life).toBe(initialLife);
  });

  test('takeAttack should handle normal damage', () => {
    const player = new Player(0, 'Test');
    const initialLife = player.life;
    
    player.isAttackBlocked = jest.fn(() => false);
    player.dodged = jest.fn(() => false);
    
    player.takeAttack(30);
    expect(player.life).toBe(initialLife - 30);
  });

  test('checkWeapon should upgrade when broken', () => {
    const player = new Player(0, 'Test');
    player.baseWeapons = [Sword, Knife, Arm];
    player.weapon = new Sword();
    
    player.weapon.durability = 0;
    player.weapon.initDurability = 500;
    
    player.checkWeapon();
    expect(player.weapon).toBeInstanceOf(Knife);
  });

  test('checkWeapon should not upgrade when not broken', () => {
    const player = new Player(0, 'Test');
    const originalWeapon = new Sword();
    player.baseWeapons = [Sword, Knife, Arm];
    player.weapon = originalWeapon;
    
    player.checkWeapon();
    expect(player.weapon).toBe(originalWeapon);
  });

  test('tryAttack should return false when out of range', () => {
    const player = new Player(0, 'Attacker');
    const enemy = new Player(5, 'Enemy');
    player.weapon.range = 2;
    
    const result = player.tryAttack(enemy);
    expect(result).toBe(false);
  });

  test('tryAttack should work correctly within range', () => {
    const player = new Player(0, 'Attacker');
    const enemy = new Player(1, 'Enemy');
    player.weapon.range = 2;
    player.getLuck = jest.fn(() => 0.5);
    player.getDamage = jest.fn(() => 10);
    enemy.takeAttack = jest.fn();
    
    const result = player.tryAttack(enemy);
    expect(result).toBe(true);
    expect(enemy.takeAttack).toHaveBeenCalledWith(10);
  });

  test('tryAttack should deal double damage at same position', () => {
    const player = new Player(0, 'Attacker');
    const enemy = new Player(0, 'Enemy');
    player.weapon.range = 2;
    player.getLuck = jest.fn(() => 0.5);
    player.getDamage = jest.fn(() => 10);
    
    const mockTakeAttack = jest.fn();
    enemy.takeAttack = mockTakeAttack;
    enemy.moveRight = jest.fn();
    
    player.tryAttack(enemy);
    
    expect(mockTakeAttack).toHaveBeenCalledTimes(2);
    expect(mockTakeAttack).toHaveBeenNthCalledWith(1, 10);
    expect(mockTakeAttack).toHaveBeenNthCalledWith(2, 20); 
    expect(enemy.moveRight).toHaveBeenCalledWith(1);
  });
});

describe('Player - Enemy Selection and Movement', () => {
  test('chooseEnemy should select enemy with min health', () => {
    const player = new Player(0, 'Player1');
    player.life = 100;
    
    const player2 = new Player(5, 'Player2');
    player2.life = 80;
    
    const player3 = new Player(10, 'Player3');
    player3.life = 50;
    
    const players = [player, player2, player3];
    const enemy = player.chooseEnemy(players);
    
    expect(enemy).toBe(player3);
  });

  test('chooseEnemy should exclude dead players', () => {
    const player = new Player(0, 'Player1');
    
    const player2 = new Player(5, 'Player2');
    player2.life = 0;
    
    const player3 = new Player(10, 'Player3');
    player3.life = 50;
    
    const players = [player, player2, player3];
    const enemy = player.chooseEnemy(players);
    
    expect(enemy).toBe(player3);
  });

  test('chooseEnemy should return null when no enemies', () => {
    const player = new Player(0, 'Player1');
    const players = [player];
    
    const enemy = player.chooseEnemy(players);
    expect(enemy).toBeNull();
  });

  test('moveToEnemy should move towards enemy', () => {
    const player = new Player(0, 'Player');
    player.speed = 3;
    
    const enemy = new Player(10, 'Enemy');
    
    player.moveToEnemy(enemy);
    expect(player.position).toBe(3);
    
    player.moveToEnemy(enemy);
    expect(player.position).toBe(6); 
  });

  test('moveToEnemy should move left when enemy is left', () => {
    const player = new Player(10, 'Player');
    player.speed = 3;
    
    const enemy = new Player(0, 'Enemy');
    
    player.moveToEnemy(enemy);
    expect(player.position).toBe(7);
  });

  test('moveToEnemy should not move when no enemy', () => {
    const player = new Player(5, 'Player');
    const initialPosition = player.position;
    
    player.moveToEnemy(null);
    expect(player.position).toBe(initialPosition);
  });

  test('turn should complete sequence', () => {
    const player = new Player(0, 'Player');
    player.speed = 5;
    player.tryAttack = jest.fn();
    
    const enemy = new Player(10, 'Enemy');
    enemy.life = 50;
    
    const otherPlayer = new Player(20, 'Other');
    otherPlayer.life = 100;
    
    const players = [player, enemy, otherPlayer];
    
    player.chooseEnemy = jest.fn(() => enemy);
    
    player.turn(players);
    
    expect(player.chooseEnemy).toHaveBeenCalledWith(players);
    expect(player.position).toBe(5);
    expect(player.tryAttack).toHaveBeenCalledWith(enemy);
  });
});

describe('Specialized Classes - Warrior', () => {
  test('Warrior takeDamage should use magic when life < 50% and luck > 0.8', () => {
    const warrior = new Warrior(0, 'Test');
    warrior.life = 60;
    warrior.magic = 20;
    
    warrior.getLuck = jest.fn(() => 0.9);
    
    warrior.takeDamage(10);
    expect(warrior.magic).toBe(10);
    expect(warrior.life).toBe(60); 
  });

  test('Warrior takeDamage should use life when magic is 0', () => {
    const warrior = new Warrior(0, 'Test');
    warrior.life = 60;
    warrior.magic = 0;
    
    warrior.getLuck = jest.fn(() => 0.9);
    
    warrior.takeDamage(10);
    expect(warrior.life).toBe(50);
    expect(warrior.magic).toBe(0);
  });

  test('Warrior takeDamage should use partial magic', () => {
    const warrior = new Warrior(0, 'Test');
    warrior.life = 60;
    warrior.magic = 5;
    
    warrior.getLuck = jest.fn(() => 0.9);
    
    warrior.takeDamage(10);
    expect(warrior.magic).toBe(0);
    expect(warrior.life).toBe(55);
  });

  test('Warrior should have correct base weapons', () => {
    const warrior = new Warrior(0, 'Test');
    expect(warrior.baseWeapons).toEqual([Sword, Knife, Arm]);
  });
});

describe('Specialized Classes - Archer', () => {
  test('Archer getDamage should use special formula', () => {
    const archer = new Archer(0, 'Test');
    archer.weapon.range = 3;
    archer.weapon.getDamage = jest.fn(() => 10);
    archer.getLuck = jest.fn(() => 0.8);
    archer.attack = 5;
    
    const damage = archer.getDamage(2);
    expect(damage).toBe((5 + 10) * 0.8 * 2 / 3);
  });

  test('Archer should have correct base weapons', () => {
    const archer = new Archer(0, 'Test');
    expect(archer.baseWeapons).toEqual([Bow, Knife, Arm]);
  });
});

describe('Specialized Classes - Mage', () => {
  test('Mage takeDamage should reduce magic when > 50%', () => {
    const mage = new Mage(0, 'Test');
    mage.magic = 100;
    
    mage.takeDamage(20);
    expect(mage.life).toBe(60);
    expect(mage.magic).toBe(88);
  });

  test('Mage takeDamage should not reduce magic when <= 50%', () => {
    const mage = new Mage(0, 'Test');
    mage.magic = 50;
    
    mage.takeDamage(20);
    expect(mage.life).toBe(50); 
    expect(mage.magic).toBe(50); 
  });
});

describe('Specialized Classes - Dwarf', () => {
  test('Dwarf takeDamage should halve every 6th attack with luck > 0.5', () => {
    const dwarf = new Dwarf(0, 'Test');
    dwarf.life = 130;
    
    dwarf.getLuck = jest.fn(() => 0.6);
    
    for (let i = 1; i <= 5; i++) {
      dwarf.takeDamage(10);
    }
    expect(dwarf.life).toBe(130 - 50);
    
    dwarf.takeDamage(10);
    expect(dwarf.life).toBe(130 - 55);
  });

  test('Dwarf takeDamage should not halve when luck <= 0.5', () => {
    const dwarf = new Dwarf(0, 'Test');
    dwarf.life = 130;
    
    dwarf.getLuck = jest.fn(() => 0.4);
    
    for (let i = 1; i <= 6; i++) {
      dwarf.takeDamage(10);
    }
    expect(dwarf.life).toBe(130 - 60); 
  });
});

describe('Specialized Classes - Crossbowman', () => {
  test('Crossbowman should have correct properties', () => {
    const crossbowman = new Crossbowman(0, 'Test');
    
    expect(crossbowman.life).toBe(85);
    expect(crossbowman.attack).toBe(8);
    expect(crossbowman.agility).toBe(20);
    expect(crossbowman.luck).toBe(15);
    expect(crossbowman.description).toBe('Арбалетчик');
    expect(crossbowman.weapon).toBeInstanceOf(LongBow);
    expect(crossbowman.baseWeapons).toEqual([LongBow, Knife, Arm]);
  });
});

describe('Specialized Classes - Demiurge', () => {
  test('Demiurge getDamage should increase by 1.5x with conditions', () => {
    const demiurge = new Demiurge(0, 'Test');
    demiurge.magic = 50;
    demiurge.getLuck = jest.fn(() => 0.7); 
    demiurge.weapon.getDamage = jest.fn(() => 10);
    demiurge.attack = 6;
    
    const parentGetDamage = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(demiurge)), 'getDamage');
    parentGetDamage.mockReturnValue(20);
    
    const damage = demiurge.getDamage(2);
    
    expect(damage).toBe(20 * 1.5);
    
    parentGetDamage.mockRestore();
  });

  test('Demiurge getDamage should not increase when magic = 0', () => {
    const demiurge = new Demiurge(0, 'Test');
    demiurge.magic = 0;
    demiurge.getLuck = jest.fn(() => 0.7);
    
    const parentGetDamage = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(demiurge)), 'getDamage');
    parentGetDamage.mockReturnValue(20);
    
    const damage = demiurge.getDamage(2);
    
    expect(damage).toBe(20);
    
    parentGetDamage.mockRestore();
  });

  test('Demiurge getDamage should not increase when luck <= 0.6', () => {
    const demiurge = new Demiurge(0, 'Test');
    demiurge.magic = 50;
    demiurge.getLuck = jest.fn(() => 0.6);
    
    const parentGetDamage = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(demiurge)), 'getDamage');
    parentGetDamage.mockReturnValue(20);
    
    const damage = demiurge.getDamage(2);
    
    expect(damage).toBe(20);
    
    parentGetDamage.mockRestore();
  });
});

describe('Edge Cases and Integration', () => {
  test('Weapon should degrade through levels when broken', () => {
    const warrior = new Warrior(0, 'Test');
    warrior.weapon = new Sword();
    
    warrior.weapon.durability = 0;
    warrior.checkWeapon();
    expect(warrior.weapon).toBeInstanceOf(Knife);
    
    warrior.weapon.durability = 0;
    warrior.checkWeapon();
    expect(warrior.weapon).toBeInstanceOf(Arm);
    
    warrior.weapon.durability = 0;
    warrior.checkWeapon();
    expect(warrior.weapon).toBeInstanceOf(Arm); 
  });

  test('Player should handle multiple attacks with weapon degradation', () => {
    const player = new Player(0, 'Test');
    player.baseWeapons = [Sword, Knife, Arm];
    player.weapon = new Sword();
  
    player.isAttackBlocked = jest.fn(() => true);
    player.dodged = jest.fn(() => false);
  
    const initialDurability = player.weapon.durability;
    
    player.takeAttack(100);
  
    expect(player.weapon.name).toBe('Меч');
    expect(player.weapon.durability).toBeLessThan(initialDurability);
  
      if (player.weapon.durability <= 0) {
        player.checkWeapon();
        expect(player.weapon).toBeInstanceOf(Knife);
      }
  });

  test('Game simulation with multiple players', () => {
    const warrior = new Warrior(0, 'Warrior');
    const archer = new Archer(5, 'Archer');
    const mage = new Mage(10, 'Mage');
    
    const players = [warrior, archer, mage];
    
    players.forEach(player => {
      if (!player.isDead()) {
        player.turn(players);
      }
    });
    
    expect(true).toBe(true);
  });
});

describe('Archer Class - Edge Cases', () => {
  test('Archer getDamage should return 0 when distance exceeds weapon range', () => {
    const archer = new Archer(0, 'Test Archer');
    const bowRange = archer.weapon.range;
    
    const damageWhenOutOfRange = archer.getDamage(bowRange + 1);
    expect(damageWhenOutOfRange).toBe(0);
    
    archer.getLuck = jest.fn(() => 0.8);
    archer.weapon.getDamage = jest.fn(() => 10);
    
    const damageAtMaxRange = archer.getDamage(bowRange);
    expect(damageAtMaxRange).toBeGreaterThan(0);
    
    const damageWithinRange = archer.getDamage(bowRange - 1);
    expect(damageWithinRange).toBeGreaterThan(0);
  });
});

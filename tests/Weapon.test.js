import Weapon from '../src/js/weapons/Weapon.js';
import Arm from '../src/js/weapons/Arm.js';
import Bow from '../src/js/weapons/Bow.js';
import Sword from '../src/js/weapons/Sword.js';
import Knife from '../src/js/weapons/Knife.js';
import Staff from '../src/js/weapons/Staff.js';
import LongBow from '../src/js/weapons/LongBow.js';
import Axe from '../src/js/weapons/Axe.js';
import StormStaff from '../src/js/weapons/StormStaff.js';

describe('Weapon Class (default export)', () => {
  test('should create weapon with correct properties', () => {
    const weapon = new Weapon('Test Weapon', 10, 100, 2);
    
    expect(weapon.name).toBe('Test Weapon');
    expect(weapon.attack).toBe(10);
    expect(weapon.initDurability).toBe(100);
    expect(weapon.durability).toBe(100);
    expect(weapon.range).toBe(2);
  });

  test('takeDamage should reduce durability correctly', () => {
    const weapon = new Weapon('Test Weapon', 10, 100, 2);
    
    weapon.takeDamage(30);
    expect(weapon.durability).toBe(70);
    
    weapon.takeDamage(50);
    expect(weapon.durability).toBe(20);
  });

  test('takeDamage should not go below 0', () => {
    const weapon = new Weapon('Test Weapon', 10, 100, 2);
    
    weapon.takeDamage(150);
    expect(weapon.durability).toBe(0);
  });

  test('getDamage should return full attack when durability >= 30%', () => {
    const weapon = new Weapon('Test Weapon', 20, 100, 2);
    
    // 100% durability
    weapon.durability = 100;
    expect(weapon.getDamage()).toBe(20);
    
    // 50% durability
    weapon.durability = 50;
    expect(weapon.getDamage()).toBe(20);
    
    // Exactly 30% durability
    weapon.durability = 30;
    expect(weapon.getDamage()).toBe(20);
  });

  test('getDamage should return half attack when durability < 30%', () => {
    const weapon = new Weapon('Test Weapon', 20, 100, 2);
    
    // 29% durability
    weapon.durability = 29;
    expect(weapon.getDamage()).toBe(10);
    
    // 15% durability
    weapon.durability = 15;
    expect(weapon.getDamage()).toBe(10);
    
    // 1% durability
    weapon.durability = 1;
    expect(weapon.getDamage()).toBe(10);
  });

  test('getDamage should return 0 when durability is 0', () => {
    const weapon = new Weapon('Test Weapon', 20, 100, 2);
    
    weapon.durability = 0;
    expect(weapon.getDamage()).toBe(0);
  });

  test('getDamage should return 0 when durability is negative', () => {
    const weapon = new Weapon('Test Weapon', 20, 100, 2);
    
    weapon.durability = -10;
    expect(weapon.getDamage()).toBe(0);
  });

  test('isBroken should return true when durability is 0', () => {
    const weapon = new Weapon('Test Weapon', 20, 100, 2);
    
    expect(weapon.isBroken()).toBe(false);
    
    weapon.durability = 0;
    expect(weapon.isBroken()).toBe(true);
  });

  test('isBroken should return false when durability > 0', () => {
    const weapon = new Weapon('Test Weapon', 20, 100, 2);
    
    weapon.durability = 1;
    expect(weapon.isBroken()).toBe(false);
    
    weapon.durability = 100;
    expect(weapon.isBroken()).toBe(false);
  });

  test('takeDamage should not affect Infinity durability', () => {
    const weapon = new Weapon('Test Weapon', 1, Infinity, 1);
    
    weapon.takeDamage(1000);
    expect(weapon.durability).toBe(Infinity);
    expect(weapon.isBroken()).toBe(false);
  });

  test('getDamage with Infinity durability should always return full attack', () => {
    const weapon = new Weapon('Test Weapon', 1, Infinity, 1);
    
    expect(weapon.getDamage()).toBe(1);
    
    // Даже после "урона"
    weapon.takeDamage(1000);
    expect(weapon.getDamage()).toBe(1);
  });
});

describe('Specific Weapon Classes', () => {
  test('Arm should have correct properties', () => {
    const arm = new Arm();
    
    expect(arm.name).toBe('Рука');
    expect(arm.attack).toBe(1);
    expect(arm.durability).toBe(Infinity);
    expect(arm.initDurability).toBe(Infinity);
    expect(arm.range).toBe(1);
  });

  test('Bow should have correct properties', () => {
    const bow = new Bow();
    
    expect(bow.name).toBe('Лук');
    expect(bow.attack).toBe(10);
    expect(bow.durability).toBe(200);
    expect(bow.initDurability).toBe(200);
    expect(bow.range).toBe(3);
  });

  test('Sword should have correct properties', () => {
    const sword = new Sword();
    
    expect(sword.name).toBe('Меч');
    expect(sword.attack).toBe(25);
    expect(sword.durability).toBe(500);
    expect(sword.initDurability).toBe(500);
    expect(sword.range).toBe(1);
  });

  test('Knife should have correct properties', () => {
    const knife = new Knife();
    
    expect(knife.name).toBe('Нож');
    expect(knife.attack).toBe(5);
    expect(knife.durability).toBe(300);
    expect(knife.initDurability).toBe(300);
    expect(knife.range).toBe(1);
  });

  test('Staff should have correct properties', () => {
    const staff = new Staff();
    
    expect(staff.name).toBe('Посох');
    expect(staff.attack).toBe(8);
    expect(staff.durability).toBe(300);
    expect(staff.initDurability).toBe(300);
    expect(staff.range).toBe(2);
  });

  test('LongBow should extend Bow and override properties', () => {
    const longBow = new LongBow();
    
    expect(longBow).toBeInstanceOf(Bow);
    expect(longBow.name).toBe('Длинный лук');
    expect(longBow.attack).toBe(15);
    expect(longBow.range).toBe(4);
    expect(longBow.durability).toBe(200); // Унаследовано от Bow
  });

  test('Axe should extend Sword and override properties', () => {
    const axe = new Axe();
    
    expect(axe).toBeInstanceOf(Sword);
    expect(axe.name).toBe('Секира');
    expect(axe.attack).toBe(27);
    expect(axe.durability).toBe(800);
    expect(axe.initDurability).toBe(800);
    expect(axe.range).toBe(1); // Унаследовано от Sword
  });

  test('StormStaff should extend Staff and override properties', () => {
    const stormStaff = new StormStaff();
    
    expect(stormStaff).toBeInstanceOf(Staff);
    expect(stormStaff.name).toBe('Посох Бури');
    expect(stormStaff.attack).toBe(10);
    expect(stormStaff.range).toBe(3);
    expect(stormStaff.durability).toBe(300); // Унаследовано от Staff
  });
});

describe('Weapon functionality examples from task', () => {
  test('Example 1: Basic weapon damage', () => {
    const weapon = new Weapon('Старый меч', 20, 10, 1);
    expect(weapon.durability).toBe(10);
    
    weapon.takeDamage(5);
    expect(weapon.durability).toBe(5);
    
    weapon.takeDamage(50);
    expect(weapon.durability).toBe(0);
  });

  test('Example 2: Arm durability (Infinity)', () => {
    const arm = new Arm();
    arm.takeDamage(20);
    expect(arm.durability).toBe(Infinity);
  });

  test('Example 3: Sword damage calculation', () => {
    const sword = new Sword();
    expect(sword.durability).toBe(500);
    
    sword.takeDamage(20);
    expect(sword.durability).toBe(480);
    
    sword.takeDamage(100);
    expect(sword.durability).toBe(380);
  });

  test('Example 4: Bow getDamage at different durability levels', () => {
    const bow = new Bow();
    
    // Full durability (100%)
    expect(bow.getDamage()).toBe(10);
    expect(bow.durability).toBe(200);
    
    // Reduce to 50% (still >= 30%)
    bow.takeDamage(100);
    expect(bow.getDamage()).toBe(10);
    expect(bow.durability).toBe(100);
    
    // Reduce to 25% (< 30%)
    bow.takeDamage(50);
    expect(bow.getDamage()).toBe(5);
    expect(bow.durability).toBe(50);
    
    // Reduce to 0%
    bow.takeDamage(150);
    expect(bow.getDamage()).toBe(0);
    expect(bow.durability).toBe(0);
    expect(bow.isBroken()).toBe(true);
  });
});
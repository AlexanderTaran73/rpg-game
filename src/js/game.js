import Archer from './characters/Archer';
import Warrior from './characters/Warrior';
import Mage from './characters/Mage';
import Dwarf from './characters/Dwarf';
import Crossbowman from './characters/Crossbowman';
import Demiurge from './characters/Demiurge';

export function play() {
  const players = [
    new Warrior(0, 'Воин'),
    new Archer(5, 'Лучник'),
    new Mage(10, 'Маг'),
    new Dwarf(15, 'Гном'),
    new Crossbowman(20, 'Арбалетчик'),
    new Demiurge(25, 'Демиург'),
  ];

  let round = 1;
  const maxRounds = 100;

  console.log('=== НАЧАЛО ИГРЫ ===');

  while (round <= maxRounds) {
    console.log(`\n=== Раунд ${round} ===`);

    const alivePlayers = players.filter(player => !player.isDead());
    
    if (alivePlayers.length <= 1) {
      break;
    }

    alivePlayers.forEach(player => {
      if (!player.isDead()) {
        player.turn(players);
      }
    });

    players.forEach(player => {
      console.log(
        `${player.name} (${player.description}): ` +
        `❤️ ${player.life.toFixed(1)} | ` +
        `🔮 ${player.magic} | ` +
        `📍 ${player.position} | ` +
        `⚔️ ${player.weapon.name} (${player.weapon.durability})`
      );
    });

    round++;
  }

  const winners = players.filter(player => !player.isDead());
  
  if (winners.length === 1) {
    console.log(`\n🎉 ПОБЕДИТЕЛЬ: ${winners[0].name} (${winners[0].description})!`);
  } else if (winners.length > 1) {
    console.log('\n🤝 НИЧЬЯ между:');
    winners.forEach(winner => {
      console.log(`  ${winner.name} (${winner.description})`);
    });
  } else {
    console.log('\n💀 ВСЕ ПОГИБЛИ!');
  }

  return players;
}

export {
  Archer,
  Warrior,
  Mage,
  Dwarf,
  Crossbowman,
  Demiurge,
};
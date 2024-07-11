let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["木棒"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: '木棒', power: 5 },
  { name: '小刀', power: 30 },
  { name: '拔钉锤', power: 50 },
  { name: '宝剑', power: 100 }
];
const monsters = [
  {
    name: "软泥怪",
    level: 2,
    health: 15
  },
  {
    name: "尖牙兽",
    level: 8,
    health: 60
  },
  {
    name: "巨龙",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "城镇广场",
    "button text": ["去商店", "去洞穴", "斗恶龙"],
    "button functions": [goStore, goCave, fightDragon],
    text: "你在城镇广场中，你看到了一个招牌，上面写着：“商店”。"
  },
  {
    name: "商店",
    "button text": ["买10生命值（10金币）", "买武器（30金币）", "去城镇广场"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "你走进商店，店员说：“欢迎！欢迎！欢迎！欢迎！欢迎！欢迎！欢迎！欢迎！欢迎！欢迎！欢迎！欢迎！欢迎！欢迎！"
  },
  {
    name: "洞穴",
    "button text": ["斗软泥怪", "斗怪物", "去城镇广场"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "你走进洞穴，发现里面有两头怪物——一只软泥怪和一头尖牙兽。"
  },
  {
    name: "战斗",
    "button text": ["攻击", "躲避", "逃跑"],
    "button functions": [attack, dodge, goTown],
    text: "你遇到一个怪物！"
  },
  {
    name: "杀死怪物",
    "button text": ["去城镇广场", "去城镇广场", "去城镇广场"],
    "button functions": [goTown, goTown, easterEgg],
    text: '怪物大叫一声“啊~~”就挂了，你获得了金币和经验值。'
  },
  {
    name: "输了",
    "button text": ["再来一盘？", "再来一盘？", "再来一盘？"],
    "button functions": [restart, restart, restart],
    text: "你挂了。 &#x2620;"
  },
  { 
    name: "赢了", 
    "button text": ["再来一盘？", "再来一盘？", "再来一盘？"], 
    "button functions": [restart, restart, restart], 
    text: "你打败了恶龙！恭喜你！ &#x1F389;" 
  },
  {
    name: "彩蛋",
    "button text": ["2", "8", "去城镇广场？"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "你发现了一个秘密的游戏。选择一个数字。十个数字会随机从0到10中选择。如果你选择的数字与其中一个随机数匹配，你就赢了！"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "你没有足够的金币购买生命值。";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "现在你有了" + newWeapon + "。";
      inventory.push(newWeapon);
      text.innerText += " 在你的武器库里有：" + inventory;
    } else {
      text.innerText = "你没有足够的金币购买武器。";
    }
  } else {
    text.innerText = "你已经拥有最强大的武器了！";
    button2.innerText = "卖掉武器（15金币）";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "你卖掉了" + currentWeapon + "。";
    text.innerText += " 在你的武器库里有：" + inventory;
  } else {
    text.innerText = "不要卖掉你唯一的武器！";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "那只" + monsters[fighting].name + " 进攻了！";
  text.innerText += " 你用" + weapons[currentWeapon].name + "攻击它";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " 没打到。";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " 你的" + inventory.pop() + "坏掉了。";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "你躲过了" + monsters[fighting].name + "的攻击。";
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["木棒"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "你选择了" + guess + "。这是随机数字：\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "正确！你获得20金币！";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "错误！你损失10点生命值！";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
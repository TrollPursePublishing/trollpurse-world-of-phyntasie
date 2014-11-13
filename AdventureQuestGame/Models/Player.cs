using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Models
{
    [Serializable]
    public enum Gender : int
    {
        Male,
        Female
    }
    
    [Serializable]
    public class Player
    {
        protected Player() { }

        public Player(string name, Title title)
        {
            Id = Guid.NewGuid();
            this.name = name;
            this.title = title;
            gender = Gender.Male;
            inventory = new Inventory();
            spells = new List<Spell>();
            attributes = new PlayerAttributes();
            stats = new PlayerStats();
            navigation = new Navigation();
            equipment = new Equipment();
            engaging = null;
            isInCombat = false;
            isInside = false;
            expireRoom = false;
        }

        public Guid Id { get; private set; }
        public string name { get; private set; }
        public Gender gender { get; set; }
        public virtual Title title { get; set; }
        public virtual Inventory inventory { get; set; }
        public virtual ICollection<Spell> spells { get; set; }
        public virtual PlayerAttributes attributes { get; set; }
        public virtual PlayerStats stats { get; set; }
        public virtual Navigation navigation { get; set; }
        public virtual Equipment equipment { get; set; }
        public virtual Monster engaging { get; protected set; }
        public bool isInCombat { get; set; }
        public bool isInside { get; set; }
        public bool expireRoom { get; set; }

        public volatile bool myTurn = true;

        public void OnDeath()
        {
            attributes.state = PlayerState.Dead;
            isInCombat = false;
            isInside = false;
            myTurn = false;
            OnRevive();
        }

        public void OnRevive()
        {
            attributes.state = PlayerState.Alive;
            attributes.ResetStats();
            inventory.gold = 0;
            inventory.armors.Clear();
            inventory.weapons.Clear();
            inventory.relics.ToList().ForEach(r => stats.score -= r.value);
            inventory.relics.Clear();
            inventory.potions.Clear();
            attributes.AddExperience(-10 * attributes.level);
            expireRoom = true;
        }

        public bool OnMove(Guid placeGuid)
        {

            if (stats.placesVisited.FirstOrDefault(p => p.placesVisitedId == placeGuid) == null)
            {
                stats.areasDiscovered++;
                stats.placesVisited.Add(new PlayerVisits() { placesVisitedId = placeGuid });
                stats.score += 5;
                return true;
            }
            else
                return false;
        }

        public string FullName
        {
            get
            {
                return string.Format("{0} {1}", title.name, name);
            }
        }

        public string BuyInventoryItem(Potion item)
        {
            if (inventory.gold >= item.value)
            {
                inventory.gold -= item.value;
                AddInventoryItem(item);
                return String.Format("Purchased {0} for {1}. Remaining gold {2}", item.name, item.value, inventory.gold);
            }
            else
            {
                return String.Format("I cannot afford this! I need {0} more gold.", item.value - inventory.gold);
            }
        }

        public string BuyInventoryItem(Armor item)
        {
            if (inventory.gold >= item.value)
            {
                inventory.gold -= item.value;
                AddInventoryItem(item);
                return String.Format("Purchased {0} for {1}. Remaining gold {2}", item.name, item.value, inventory.gold);
            }
            else
            {
                return String.Format("I cannot afford this! I need {0} more gold.", item.value - inventory.gold);
            }
        }

        public string BuyInventoryItem(Weapon item)
        {
            if (inventory.gold >= item.value)
            {
                inventory.gold -= item.value;
                AddInventoryItem(item);
                return String.Format("Purchased {0} for {1}. Remaining gold {2}", item.name, item.value, inventory.gold);
            }
            else
            {
                return String.Format("I cannot afford this! I need {0} more gold.", item.value - inventory.gold);
            }
        }

        public string BuyInventoryItem(Relic item)
        {
            if (inventory.gold >= item.value)
            {
                inventory.gold -= item.value;
                AddInventoryItem(item);
                return String.Format("Purchased {0} for {1}. Remaining gold {2}", item.name, item.value, inventory.gold);
            }
            else
            {
                return String.Format("I cannot afford this! I need {0} more gold.", item.value - inventory.gold);
            }
        }

        public string AddInventoryItem(Potion item)
        {
            inventory.potions.Add(item.Copy());
            return String.Format("{0} added to inventory.", item.name);
        }

        public string AddInventoryItem(Armor item)
        {
            inventory.armors.Add(item.Copy());
            return String.Format("{0} added to inventory.", item.name);
        }

        public string AddInventoryItem(Weapon item)
        {
            inventory.weapons.Add(item.Copy());
            return String.Format("{0} added to inventory.", item.name);
        }

        public string AddInventoryItem(Relic item)
        {
            inventory.relics.Add(item.Copy());
            stats.score += item.value;
            return String.Format("{0} added to inventory.", item.name);
        }

        public Potion RemoveInventoryPotion(int index)
        {
            Potion result = inventory.potions.ElementAt(index);
            inventory.potions.Remove(result);
            return result;
        }

        public Armor RemoveInventoryArmor(int index)
        {
            Armor result = inventory.armors.ElementAt(index);
            inventory.armors.Remove(result);
            return result;
        }

        public Weapon RemoveInventoryWeapon(int index)
        {
            Weapon result = inventory.weapons.ElementAt(index);
            inventory.weapons.Remove(result);
            return result;
        }

        public Relic RemoveInventoryRelic(int index)
        {
            Relic result = inventory.relics.ElementAt(index);
            stats.score -= result.value;
            inventory.relics.Remove(result);
            return result;
        }

        public Potion RemoveInventoryPotion(Potion p)
        {
            inventory.potions.Remove(p);
            return p;
        }

        public Armor RemoveInventoryArmor(Armor a)
        {
            inventory.armors.Remove(a);
            return a;
        }

        public Weapon RemoveInventoryWeapon(Weapon w)
        {
            inventory.weapons.Remove(w);
            return w;
        }

        public Relic RemoveInventoryRelic(Relic r)
        {
            inventory.relics.Remove(r);
            return r;
        }

        public Weapon Equip(Weapon w)
        {
            Weapon old = equipment.weapon;
            equipment.weapon = w;
            return old;
        }

        public Armor Equip(Armor a)
        {
            Armor old;
            switch(a.type)
            {
                case ArmorType.Arm:
                    old = equipment.arm;
                    equipment.arm = a;
                    return old;

                case ArmorType.Feet:
                    old = equipment.feet;
                    equipment.feet = a;
                    return old;

                case ArmorType.Head:
                    old = equipment.head;
                    equipment.head = a;
                    return old;

                case ArmorType.Legs:
                    old = equipment.legs;
                    equipment.legs = a;
                    return old;

                case ArmorType.Torso:
                    old = equipment.torso;
                    equipment.torso = a;
                    return old;

                default:
                    return null;
            }
        }

        public string CastSpell(int index)
        {
            int damage = spells.ElementAt(index).damage;
            engaging.attribute.currentHealth -= damage;
            attributes.currentMana -= spells.ElementAt(index).manaCost;
            return String.Format("{0} casts {1} agains {2}, causing {3} damage!", FullName, spells.ElementAt(index).name, engaging.name, damage);
        }

        public string Attack()
        {
            int damage = 1;
            string weapon = String.Empty;
            if (equipment.weapon != null)
            {
                damage = Math.Max(1, equipment.weapon.damage + attributes.currentStrength - engaging.attribute.currentToughness);
                attributes.currentStanima -= equipment.weapon.stanimaCost;
                equipment.weapon.durability--;
                if (equipment.weapon.durability <= 0)
                {
                    weapon = String.Format("{0}, has broken!", equipment.weapon.name);
                    equipment.weapon = null;
                }
            }
            engaging.attribute.currentHealth -= damage;
            return String.Format("{0} attacks {1}, causing {2} damage! {3}", FullName, engaging.name, damage, weapon);
        }

        private int Feet() 
        {
            if (equipment.feet != null)
            {
                equipment.feet.durability--;
                return equipment.feet.armorRating;
            }
            return 0;        
        }

        private int Head()
        {
            if (equipment.head != null)
            {
                equipment.head.durability--;
                return equipment.head.armorRating;
            }
            return 0;
        }

        private int Arm()
        {
            if (equipment.arm != null)
            {
                equipment.arm.durability--;
                return equipment.arm.armorRating;
            }
            return 0;
        }

        private int Legs()
        {
            if (equipment.legs != null)
            {
                equipment.legs.durability--;
                return equipment.legs.armorRating;
            }
            return 0;
        }

        private int Torso()
        {
            if (equipment.torso != null)
            {
                equipment.torso.durability--;
                return equipment.torso.armorRating;
            }
            return 0;
        }

        public string Defend()
        {
            int f = Feet(); 
            int h = Head();
            int t = Torso();
            int a = Arm();
            int l = Legs();

            string msg = String.Empty;
            if (equipment.feet != null && equipment.feet.durability <= 0)
            {
                msg += String.Format("{0}, has broken! ", equipment.feet.name);
            }
            if (equipment.head != null && equipment.head.durability <= 0)
            {
                msg += String.Format("{0}, has broken! ", equipment.head.name);
            }
            if (equipment.torso != null && equipment.torso.durability <= 0)
            {
                msg += String.Format("{0}, has broken! ", equipment.torso.name);
            }
            if (equipment.arm != null && equipment.arm.durability <= 0)
            {
                msg += String.Format("{0}, has broken! ", equipment.arm.name);
            }
            if (equipment.legs != null && equipment.legs.durability <= 0)
            {
                msg += String.Format("{0}, has broken! ", equipment.legs.name);
            }

            int damage = Math.Max(1, engaging.attribute.currentStrength - attributes.currentToughness - f - h - t- a - l);
            attributes.currentHealth -= damage;
            return String.Format("{0} attacks {1}, causing {2} damage! {3}", engaging.name, FullName, damage, msg);
        }

        public string UsePotion(int index)
        {
            Potion use = RemoveInventoryPotion(index);

            if (use.poisonValue > 0 && engaging != null)
            {
                engaging.attribute.currentHealth -= use.poisonValue;
                return String.Format("Poisoned {0} for {1}!", engaging.name, use.poisonValue);
            }
            int healed;
            int stanima;
            int mana;
            attributes.currentHealth += healed = Math.Min(attributes.health - attributes.currentHealth, use.healingValue);
            attributes.currentMana += stanima = Math.Min(attributes.mana - attributes.currentMana, use.manaRestoreValue);
            attributes.currentStanima += mana = Math.Min(attributes.stanima - attributes.currentStanima, use.stanimaRestoreValue);
            return String.Format("Healed for {0}, Mana restored by {1}, Stanima restored by {2}", healed, mana, stanima);
        }

        public string Engage(Monster monster)
        {
            engaging = monster.Copy();
            isInCombat = true;
            return String.Format("{0} has encounterd a(n) {1}. {2}! Combat ensues!", FullName, engaging.name, engaging.description);
        }

        public string Disengage()
        {
            string name = engaging.name;
            int gold = engaging.GoldLoot;
            inventory.gold += gold;
            int exp = (engaging.GetScore % 1000) + 5;
            attributes.AddExperience(exp);
            if(engaging.type == MonsterType.Monster)
                stats.score += engaging.GetScore;
            engaging = null;
            isInCombat = false;
            stats.monstersKilled++;
            return String.Format("{0}! {1} has defeated the {2}! I have also looted {3} gold and gained {4} points of wisdom!", RandomCheer(), FullName, name, gold, exp);
        }

        protected string RandomCheer()
        {
            string[] cheers = new[]{
                "Hooray",
                "AH-HAAA",
                "Victory",
                "The world is safer now"
            };

            return cheers[new Random().Next(cheers.Length)];
        }
    }
}

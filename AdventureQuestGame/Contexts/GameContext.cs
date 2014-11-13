using AdventureQuestGame.Contexts.Initializers;
using AdventureQuestGame.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.Infrastructure.Annotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdventureQuestGame.Contexts
{
    public class GameContext : DbContext
    {
        public GameContext() : base("name=Game")
        {
            base.Configuration.LazyLoadingEnabled = true;
        }

        public DbSet<World> worlds { get; set; }
        public DbSet<Area> areas { get; set; }
        public DbSet<Location> locations { get; set; }
        public DbSet<Room> rooms { get; set; }

        public DbSet<Armor> armors { get; set; }
        public DbSet<Market> markets { get; set; }
        public DbSet<Monster> monsters { get; set; }
        public DbSet<Player> players { get; set; }
        public DbSet<Potion> potions { get; set; }
        public DbSet<Relic> relics { get; set; }
        public DbSet<Spell> spells { get; set; }
        public DbSet<Title> titles { get; set; }
        public DbSet<Weapon> weapons { get; set; }
        public DbSet<Event> events { get; set; }
        public DbSet<PlayerStats> playerstats { get; set; }
        public DbSet<Acheivement> achievements { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<World>()
                .HasMany<Area>(w => w.areas);

            modelBuilder.Entity<Area>()
                .HasMany<Location>(a => a.locations);

            modelBuilder.Entity<Location>()
                .HasMany<Room>(l => l.rooms);

            modelBuilder.Entity<Room>()
                .HasMany<Room>(r => r.linkedRoom)
                .WithMany();

            modelBuilder.Entity<Inventory>()
                .HasMany<Armor>(i => i.armors);

            modelBuilder.Entity<Inventory>()
                .HasMany<Weapon>(i => i.weapons);

            modelBuilder.Entity<Inventory>()
                .HasMany<Relic>(i => i.relics);

            modelBuilder.Entity<Inventory>()
                .HasMany<Potion>(i => i.potions);

            modelBuilder.Entity<Player>()
                .HasMany<Spell>(p => p.spells);

            modelBuilder.Entity<Acheivement>()
                .HasRequired<Player>(a => a.player);

            modelBuilder.Entity<Market>()
                .HasRequired<Inventory>(m => m.inventory);

            modelBuilder.Entity<PlayerStats>()
                .HasMany<PlayerVisits>(p => p.placesVisited);

            base.OnModelCreating(modelBuilder);
        }
    }
}

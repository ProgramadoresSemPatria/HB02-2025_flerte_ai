using flerte_ai_backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace flerte_ai_backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Preference)
                .WithOne(p => p.User)
                .HasForeignKey<UserPreference>(p => p.UserId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Conversations)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId);

            modelBuilder.Entity<Conversation>()
                .HasMany(c => c.Messages)
                .WithOne(m => m.Conversation)
                .HasForeignKey(m => m.ConversationId);
        }
    }
}

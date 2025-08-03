namespace flerte_ai_backend.Entities
{
    public class Conversation
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Chave estrangeira para User
        public int UserId { get; set; }
        public virtual User User { get; set; }

        // Propriedade de Navegação para Messages
        public virtual ICollection<Message> Messages { get; set; }
    }
}

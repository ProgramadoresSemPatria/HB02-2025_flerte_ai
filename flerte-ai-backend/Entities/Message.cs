using flerte_ai_backend.Enumerators;

namespace flerte_ai_backend.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public SenderType Sender { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Chave estrangeira para Conversation
        public int ConversationId { get; set; }
        public virtual Conversation Conversation { get; set; }
    }
}

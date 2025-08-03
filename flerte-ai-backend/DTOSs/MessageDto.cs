using flerte_ai_backend.Enumerators;
using System;

namespace flerte_ai_backend.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public SenderType Sender { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
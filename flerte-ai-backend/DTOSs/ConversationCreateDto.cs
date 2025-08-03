using System.ComponentModel.DataAnnotations;

namespace flerte_ai_backend.DTOs
{
    public class ConversationCreateDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
    }
}

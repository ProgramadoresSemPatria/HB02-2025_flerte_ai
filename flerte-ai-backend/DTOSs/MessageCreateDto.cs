using System.ComponentModel.DataAnnotations;

namespace flerte_ai_backend.DTOs
{
    public class MessageCreateDto
    {
        [Required]
        [StringLength(2000)]
        public string Content { get; set; }
    }
}
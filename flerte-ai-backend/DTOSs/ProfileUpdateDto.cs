using System.ComponentModel.DataAnnotations;

namespace flerte_ai_backend.DTOs
{
    public class ProfileUpdateDto
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Name { get; set; }
    }
}

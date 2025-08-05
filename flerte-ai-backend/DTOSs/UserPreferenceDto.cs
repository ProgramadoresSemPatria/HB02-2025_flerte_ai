using System.ComponentModel.DataAnnotations;

namespace flerte_ai_backend.DTOs
{
    public class UserPreferenceDto
    {
        [Required]
        public string PersonalityStyle { get; set; }

        [Required]
        public string ResponseLength { get; set; }
    }
}
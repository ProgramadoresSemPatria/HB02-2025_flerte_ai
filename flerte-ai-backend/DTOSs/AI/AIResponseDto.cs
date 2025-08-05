using System.Text.Json.Serialization;

namespace flerte_ai_backend.DTOs.AI
{
    public class AIResponseDto
    {
        [JsonPropertyName("response")]
        public string Content { get; set; }
    }
}
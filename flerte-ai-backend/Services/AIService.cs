using flerte_ai_backend.DTOs.AI;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace flerte_ai_backend.Services
{
    public class AIService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public AIService(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        public async Task<string> GetAIResponseAsync(AIRequestDto requestDto)
        {
            var client = _httpClientFactory.CreateClient();

            var aiApiUrl = _config["AI_API_URL"];

            if (string.IsNullOrEmpty(aiApiUrl))
            {
                return "Erro: A URL da API de IA não está configurada no appsettings.json.";
            }

            try
            {
                HttpResponseMessage response = await client.PostAsJsonAsync(aiApiUrl, requestDto);

                response.EnsureSuccessStatusCode();

                var aiResponse = await response.Content.ReadFromJsonAsync<AIResponseDto>();

                return aiResponse?.Content ?? string.Empty;
            }
            catch (HttpRequestException e)
            {
                return $"Erro ao chamar a API de IA: {e.Message}";
            }
        }
    }
}
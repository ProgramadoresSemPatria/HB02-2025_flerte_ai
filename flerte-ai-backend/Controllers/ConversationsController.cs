using flerte_ai_backend.Data;
using flerte_ai_backend.DTOs;
using flerte_ai_backend.Entities;
using flerte_ai_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace flerte_ai_backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ConversationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly AIService _aiService;

        public ConversationsController(
            ApplicationDbContext context,
            AIService aiService
            )
        {
            _context = context;
            _aiService = aiService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateConversation(ConversationCreateDto createDto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("Token inválido ou não contém ID do usuário.");
            }

            var userId = int.Parse(userIdString);

            var conversation = new Conversation
            {
                Title = createDto.Title,
                UserId = userId
            };

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();

            return Ok(conversation);
        }

        [HttpGet("{id}/messages")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForConversation(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var conversation = await _context.Conversations
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (conversation == null || conversation.UserId != userId)
            {
                return NotFound("Conversa não encontrada ou não pertence ao usuário.");
            }

            var messagesDto = conversation.Messages
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    Content = m.Content,
                    Sender = m.Sender,
                    CreatedAt = m.CreatedAt
                })
                .OrderBy(m => m.CreatedAt)
                .ToList();

            return Ok(messagesDto);
        }

        [HttpPost("{id}/messages")]
        public async Task<IActionResult> AddMessageToConversation(int id, MessageCreateDto createDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var conversation = await _context.Conversations.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (conversation == null)
            {
                return NotFound("Conversa não encontrada ou não pertence ao usuário.");
            }

            var userMessage = new Message
            {
                Content = createDto.Content,
                Sender = Enumerators.SenderType.User,
                ConversationId = id
            };
            _context.Messages.Add(userMessage);
            await _context.SaveChangesAsync();

            var history = await _context.Messages
                .Where(m => m.ConversationId == id)
                .OrderByDescending(m => m.CreatedAt)
                .Take(10)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new DTOs.AI.HistoryItem(m.Sender.ToString().ToLower(), m.Content))
                .ToListAsync();

            var preferences = await _context.UserPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId);

            var preferencesDto = new DTOs.AI.PreferencesDto(
                Style: preferences?.PersonalityStyle ?? "Neutro",
                Length: preferences?.ResponseLength ?? "Média"
            );

            var aiRequestDto = new DTOs.AI.AIRequestDto(history, preferencesDto);

            var aiResponseContent = await _aiService.GetAIResponseAsync(aiRequestDto);

            var aiMessage = new Message
            {
                Content = aiResponseContent,
                Sender = Enumerators.SenderType.AI,
                ConversationId = id
            };
            _context.Messages.Add(aiMessage);
            await _context.SaveChangesAsync();

            return Ok(new MessageDto
            {
                Id = aiMessage.Id,
                Content = aiMessage.Content,
                Sender = aiMessage.Sender,
                CreatedAt = aiMessage.CreatedAt
            });
        }
    }
}
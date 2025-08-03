using flerte_ai_backend.Data;
using flerte_ai_backend.DTOs;
using flerte_ai_backend.Entities;
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

        public ConversationsController(ApplicationDbContext context)
        {
            _context = context;
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
    }
}
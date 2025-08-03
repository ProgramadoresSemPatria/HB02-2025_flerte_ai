using flerte_ai_backend.Data;
using flerte_ai_backend.DTOs;
using flerte_ai_backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    }
}
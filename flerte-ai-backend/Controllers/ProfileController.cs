using flerte_ai_backend.Data;
using flerte_ai_backend.DTOs;
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
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProfileController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetMyProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            };

            return Ok(userDto);
        }

        [HttpPut]
        public async Task<ActionResult<UserDto>> UpdateMyProfile(ProfileUpdateDto updateDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            user.Name = updateDto.Name;

            await _context.SaveChangesAsync();

            return Ok(new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            });
        }
    }
}
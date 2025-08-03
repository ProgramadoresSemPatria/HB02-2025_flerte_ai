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
    public class PreferencesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PreferencesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<UserPreferenceDto>> GetUserPreferences()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var preferences = await _context.UserPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (preferences == null)
            {
                return Ok(new UserPreferenceDto { PersonalityStyle = "Neutro", ResponseLength = "Média" });
            }

            return Ok(new UserPreferenceDto
            {
                PersonalityStyle = preferences.PersonalityStyle,
                ResponseLength = preferences.ResponseLength
            });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUserPreferences(UserPreferenceDto preferenceDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var existingPreference = await _context.UserPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (existingPreference != null)
            {
                existingPreference.PersonalityStyle = preferenceDto.PersonalityStyle;
                existingPreference.ResponseLength = preferenceDto.ResponseLength;
            }
            else
            {
                var newPreference = new UserPreference
                {
                    UserId = userId,
                    PersonalityStyle = preferenceDto.PersonalityStyle,
                    ResponseLength = preferenceDto.ResponseLength
                };
                _context.UserPreferences.Add(newPreference);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
using flerte_ai_backend.Data;
using flerte_ai_backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace flerte_ai_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto registerDto)
        {
            // Lógica de registro virá aqui
            return Ok("Usuário registrado com sucesso (lógica a ser implementada)");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto loginDto)
        {
            // Lógica de login virá aqui
            return Ok("Login bem-sucedido (lógica a ser implementada)");
        }
    }
}

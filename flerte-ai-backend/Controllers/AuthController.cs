using flerte_ai_backend.Data;
using flerte_ai_backend.DTOs;
using flerte_ai_backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
            // 1. Verificar se o e-mail já existe no banco de dados para evitar duplicatas.
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest("Este e-mail já está em uso.");
            }

            // 2. Criar o hash da senha recebida. O resultado é uma string segura.
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // 3. Criar uma nova instância da entidade User com os dados do DTO.
            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = passwordHash // Salvamos o hash, não a senha original.
            };

            // 4. Adicionar o novo usuário ao DbContext e salvar as mudanças no banco.
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 5. Retornar uma resposta de sucesso.
            return Ok(new { message = "Usuário registrado com sucesso!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto loginDto)
        {
            // Lógica de login virá aqui
            return Ok("Login bem-sucedido (lógica a ser implementada)");
        }
    }
}
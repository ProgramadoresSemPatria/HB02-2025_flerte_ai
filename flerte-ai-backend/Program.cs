using flerte_ai_backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- INÍCIO DA CONFIGURAÇÃO ---

// 1. Adiciona o DbContext para injeção de dependência.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// 2. Adiciona os serviços para os Controllers da API.
builder.Services.AddControllers();

// 3. Adiciona os serviços do Swagger para documentação da API.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configura o pipeline de requisições HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Adiciona o middleware de autorização (vamos usar em breve).
app.UseAuthorization();

// Mapeia as rotas dos seus Controllers.
app.MapControllers();

app.Run();
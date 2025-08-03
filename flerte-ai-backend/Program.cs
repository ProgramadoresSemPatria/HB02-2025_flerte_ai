using flerte_ai_backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- IN�CIO DA CONFIGURA��O ---

// 1. Adiciona o DbContext para inje��o de depend�ncia.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// 2. Adiciona os servi�os para os Controllers da API.
builder.Services.AddControllers();

// 3. Adiciona os servi�os do Swagger para documenta��o da API.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configura o pipeline de requisi��es HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Adiciona o middleware de autoriza��o (vamos usar em breve).
app.UseAuthorization();

// Mapeia as rotas dos seus Controllers.
app.MapControllers();

app.Run();
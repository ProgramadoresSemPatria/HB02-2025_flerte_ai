namespace flerte_ai_backend.Entities
{
    public class UserPreference
    {
        public int Id { get; set; }
        public string PersonalityStyle { get; set; } = "Neutro";
        public string ResponseLength { get; set; } = "Média";
        public string? CustomInstructions { get; set; }

        // Chave estrangeira para a relação um-para-um com User
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}

using Microsoft.VisualBasic;
using System.Collections.Generic;

namespace flerte_ai_backend.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        public virtual UserPreference Preference { get; set; }
        public virtual ICollection<Conversation> Conversations { get; set; }
    }
}

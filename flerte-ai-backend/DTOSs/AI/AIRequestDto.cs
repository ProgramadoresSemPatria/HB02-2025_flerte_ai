using System.Collections.Generic;

namespace flerte_ai_backend.DTOs.AI
{
    public record AIRequestDto(List<HistoryItem> History, PreferencesDto Preferences);

    public record HistoryItem(string Role, string Content);

    public record PreferencesDto(string Style, string Length);
}
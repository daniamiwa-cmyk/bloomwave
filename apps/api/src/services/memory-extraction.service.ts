import { extractWithHaiku } from './claude.service.js';
import type { MemoryCandidate, UserProfile } from '@amai/shared';

export async function extractMemories(
  userMessage: string,
  aiResponse: string,
  profile: UserProfile,
): Promise<MemoryCandidate[]> {
  const prompt = `Analyze this conversation exchange and extract any memories worth saving.

CURRENT USER PROFILE (do not re-extract known facts):
- Name: ${profile.display_name || 'Unknown'}
- Known people: ${profile.important_people?.map((p) => p.name).join(', ') || 'None yet'}
- Known calms: ${profile.what_calms?.join(', ') || 'None yet'}
- Known triggers: ${profile.what_triggers?.join(', ') || 'None yet'}

CONVERSATION EXCHANGE:
User: ${userMessage}
Assistant: ${aiResponse}

Extract memories in these categories:
1. EPISODIC: Specific events, experiences, emotions shared
2. PROFILE_UPDATE: New stable facts about the user (name, people, preferences, values)

Return JSON:
{
  "candidates": [
    {
      "content": "Full memory text",
      "summary": "One-line summary",
      "type": "episodic" | "profile_update",
      "emotion": "joyful|sad|anxious|calm|frustrated|hopeful|grateful|angry|vulnerable|excited|reflective|neutral",
      "tags": ["tag1", "tag2"],
      "relevance_score": 0.0-1.0,
      "emotional_weight": 0.0-1.0,
      "confidence": 0.0-1.0,
      "profile_field": "field_name or null",
      "profile_value": "value or null"
    }
  ]
}

RULES:
- Only extract genuinely meaningful information
- Do NOT extract small talk or filler
- Score emotional moments higher (vulnerability, breakthroughs, fears, hopes)
- For profile updates: only extract if confidence > 0.7
- If the user corrects something, that's HIGH confidence profile update
- Return empty candidates array if nothing worth remembering`;

  try {
    const raw = extractWithHaiku(prompt);
    const text = await raw;
    const parsed = JSON.parse(text);
    return parsed.candidates || [];
  } catch (err) {
    console.error('Memory extraction failed:', err);
    return [];
  }
}

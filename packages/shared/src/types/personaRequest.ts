export interface CreatePersonaRequestBody {
  name: string;
  gender: string;
  archetype: string;
  description: string;
}

export interface PersonaRequestResponse {
  success: boolean;
  id: string;
}

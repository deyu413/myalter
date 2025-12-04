export interface GhostProfile {
    traits: string[];
    communication_style: string;
    red_flags: string[];
    mating_value: number; // 0-10
    short_bio: string;
}

export interface SimulationDialogue {
    speaker: 'A' | 'B';
    text: string;
    action?: string;
}

export interface SimulationResult {
    score: number; // 0-100
    summary: string;
    dialogue: SimulationDialogue[];
    flags_triggered: string[];
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    base_context: string;
    environment_variables: string[];
    chaos_cards: string[];
}

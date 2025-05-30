
import { DocumentType, LegalCategory, DocumentAnalysis, LegalAdvice, LegalQuery, LegalDocument } from '../types/legal';
import { SwedishLegalPrompts } from './swedishLegalPrompts';

export class AIAnalysisEngine {
  private static readonly API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
  
  // In production, this would come from Supabase Edge Functions with proper secret management
  private static readonly MODEL = 'gpt-4.5-preview';

  static async analyzeDocument(document: LegalDocument): Promise<DocumentAnalysis> {
    const prompt = this.buildDocumentAnalysisPrompt(document);
    
    const response = await this.callAI(prompt);
    return this.parseDocumentAnalysis(response);
  }

  static async answerLegalQuery(query: LegalQuery): Promise<LegalAdvice> {
    const prompt = this.buildLegalQueryPrompt(query);
    
    const response = await this.callAI(prompt);
    return this.parseLegalAdvice(response);
  }

  static async generateFollowUpQuestions(context: string): Promise<string[]> {
    const prompt = `${SwedishLegalPrompts.getSystemPrompt()}\n\n${SwedishLegalPrompts.getFollowUpPrompt()}\n\nKontext: ${context}`;
    
    const response = await this.callAI(prompt);
    return this.parseFollowUpQuestions(response);
  }

  private static buildDocumentAnalysisPrompt(document: LegalDocument): string {
    const systemPrompt = SwedishLegalPrompts.getSystemPrompt();
    const analysisPrompt = SwedishLegalPrompts.getDocumentAnalysisPrompt(document.type);
    
    return `${systemPrompt}\n\n${analysisPrompt}\n\nDOKUMENT ATT ANALYSERA:\n${document.content}\n\nMETADATA:\nDokumenttyp: ${document.type}\nAkuthetsnivå: ${document.metadata?.urgency_level}\nNyckelord: ${document.metadata?.keywords?.join(', ')}\n\nSVARA I STRUKTURERAT JSON-FORMAT med fälten: summary, key_points, legal_issues, recommendations, next_steps, references, urgency_assessment`;
  }

  private static buildLegalQueryPrompt(query: LegalQuery): string {
    const systemPrompt = SwedishLegalPrompts.getSystemPrompt();
    const categoryPrompt = SwedishLegalPrompts.getLegalCategoryPrompt(query.category);
    
    let context = '';
    if (query.context) {
      context = `\n\nKONTEXT: ${query.context}`;
    }
    
    return `${systemPrompt}\n\n${categoryPrompt}\n\nFRÅGA: ${query.question}${context}\n\nSVARA I STRUKTURERAT JSON-FORMAT med fälten: answer, confidence, legal_basis, practical_steps, warnings, follow_up_questions`;
  }

  private static async callAI(prompt: string): Promise<string> {
    // Note: In production, this would be handled by Supabase Edge Functions
    // with proper API key management through Supabase secrets
    console.log('AI Analysis Request:', prompt);
    
    // Mock response for development - replace with actual OpenAI API call
    return this.getMockResponse(prompt);
  }

  private static getMockResponse(prompt: string): string {
    // Mock structured response for testing
    if (prompt.includes('DOKUMENT ATT ANALYSERA')) {
      return JSON.stringify({
        summary: "Detta är en uppsägning av hyreskontrakt med grund i störningar.",
        key_points: [
          "Uppsägning enligt 12 kap 46§ Jordabalken",
          "Grund: upprepade störningar",
          "Uppsägningstid: 3 månader",
          "Möjlighet att bestrida inom 6 veckor"
        ],
        legal_issues: [{
          title: "Störningsgrundad uppsägning",
          description: "Hyresvärden hävdar störningar som grund för uppsägning",
          severity: "high",
          legal_basis: ["12 kap 46§ JB"],
          potential_outcomes: ["Avhysning", "Förlikning", "Fortsatt hyresförhållande"]
        }],
        recommendations: [{
          action: "Kontakta Hyresgästföreningen omedelbart",
          rationale: "Professionell juridisk rådgivning behövs",
          timeline: "Inom 48 timmar",
          resources_needed: ["Medlemskap", "Dokumentation"],
          success_probability: 0.7
        }],
        next_steps: [{
          step: "Dokumentera alla kommunikationer",
          description: "Samla bevis som motbevisar störningspåståendena",
          priority: 1,
          contacts: [{
            name: "Hyresgästföreningen",
            type: "legal_aid",
            phone: "08-123 456 78"
          }]
        }],
        references: [{
          law_name: "Jordabalken",
          section: "12 kap 46§",
          description: "Hyresvärdens uppsägningsrätt vid störningar",
          relevance_score: 0.95
        }],
        urgency_assessment: {
          level: "high",
          reasoning: "Begränsad tid för att bestrida uppsägningen",
          time_sensitive_actions: ["Kontakta juridisk rådgivning", "Samla dokumentation"],
          consequences_of_delay: ["Förlorad möjlighet att bestrida", "Avhysning"]
        }
      });
    }
    
    return JSON.stringify({
      answer: "Baserat på svensk hyresrätt har du rätt att bestrida denna uppsägning.",
      confidence: 0.85,
      legal_basis: [{
        law_name: "Jordabalken",
        section: "12 kap",
        description: "Hyresrättsliga bestämmelser"
      }],
      practical_steps: [
        "Kontakta Hyresgästföreningen",
        "Samla dokumentation",
        "Ansök om rättshjälp"
      ],
      warnings: ["Agera snabbt - begränsade tidsfrister"],
      follow_up_questions: [
        "Har du dokumentation på kommunikation med hyresvärden?",
        "Finns det vittnen till de påstådda störningarna?"
      ]
    });
  }

  private static parseDocumentAnalysis(response: string): DocumentAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse document analysis response:', error);
      throw new Error('Invalid AI response format');
    }
  }

  private static parseLegalAdvice(response: string): LegalAdvice {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse legal advice response:', error);
      throw new Error('Invalid AI response format');
    }
  }

  private static parseFollowUpQuestions(response: string): string[] {
    try {
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : parsed.questions || [];
    } catch (error) {
      console.error('Failed to parse follow-up questions:', error);
      return [];
    }
  }
}

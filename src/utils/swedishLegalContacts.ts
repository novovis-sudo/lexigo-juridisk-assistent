
export interface LegalContact {
  name: string;
  type: 'authority' | 'legal_aid' | 'ombudsman' | 'court' | 'union' | 'organization';
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  specialization?: string[];
  free_service: boolean;
  languages: string[];
}

export class SwedishLegalContacts {
  private static readonly CONTACTS: LegalContact[] = [
    // Authorities
    {
      name: "Kronofogdemyndigheten",
      type: "authority",
      description: "Statlig myndighet för skuldinrivning och verkställighet",
      phone: "0771-79 79 79",
      website: "https://kronofogden.se",
      specialization: ["debt_collection", "enforcement", "debt_restructuring"],
      free_service: true,
      languages: ["sv", "en"]
    },
    {
      name: "Försäkringskassan",
      type: "authority", 
      description: "Handlägger socialförsäkringar och familjestöd",
      phone: "0771-524 524",
      website: "https://forsakringskassan.se",
      specialization: ["social_benefits", "insurance", "family_support"],
      free_service: true,
      languages: ["sv", "en", "ar", "so"]
    },
    {
      name: "Arbetsförmedlingen",
      type: "authority",
      description: "Arbetstjänster och arbetslöshetsersättning",
      phone: "0771-60 00 00", 
      website: "https://arbetsformedlingen.se",
      specialization: ["employment", "unemployment_benefits"],
      free_service: true,
      languages: ["sv", "en"]
    },

    // Legal Aid Organizations
    {
      name: "Hyresgästföreningen",
      type: "legal_aid",
      description: "Juridisk rådgivning inom hyresrätt för medlemmar",
      phone: "08-791 40 00",
      website: "https://hyresgastforeningen.se",
      specialization: ["rental_law", "tenant_rights"],
      free_service: false, // Requires membership
      languages: ["sv"]
    },
    {
      name: "Konsumentvägledning",
      type: "legal_aid", 
      description: "Kostnadsfri rådgivning för konsumentfrågor",
      phone: "0771-42 33 00",
      website: "https://konsumentverket.se",
      specialization: ["consumer_rights", "contracts", "warranties"],
      free_service: true,
      languages: ["sv", "en"]
    },
    {
      name: "Juristjouren",
      type: "legal_aid",
      description: "Kostnadsfri juridisk rådgivning per telefon",
      phone: "08-692 39 39",
      website: "https://juristjouren.se",
      specialization: ["general_legal", "preliminary_advice"],
      free_service: true,
      languages: ["sv"]
    },

    // Ombudsmen
    {
      name: "Diskrimineringsombudsmannen (DO)",
      type: "ombudsman",
      description: "Övervakar efterlevnad av diskrimineringslagen",
      phone: "08-120 186 00",
      email: "do@do.se",
      website: "https://do.se",
      specialization: ["discrimination", "equal_rights"],
      free_service: true,
      languages: ["sv", "en"]
    },
    {
      name: "Konsumentombudsmannen (KO)",
      type: "ombudsman",
      description: "Övervakar marknadsföringslagen och konsumentskydd",
      phone: "08-700 18 00",
      website: "https://konsumentverket.se/ko",
      specialization: ["consumer_protection", "marketing_law"],
      free_service: true,
      languages: ["sv"]
    },

    // Courts
    {
      name: "Hyresnämnden",
      type: "court",
      description: "Särskild domstol för hyrestvister",
      phone: "08-785 10 00",
      website: "https://hyresnamnden.se",
      specialization: ["rental_disputes", "rent_setting"],
      free_service: false, // Court fees apply
      languages: ["sv"]
    },
    {
      name: "Förvaltningsrätten",
      type: "court",
      description: "Prövar överklaganden av myndighetsbeslut",
      website: "https://domstol.se",
      specialization: ["administrative_appeals", "benefit_decisions"],
      free_service: false,
      languages: ["sv"]
    },

    // Unions and Organizations
    {
      name: "Hyresgäst Information & Support",
      type: "organization",
      description: "Ideell förening som hjälper hyresgäster",
      email: "info@hyresgastinfo.se", 
      website: "https://hyresgastinfo.se",
      specialization: ["rental_law", "tenant_support"],
      free_service: true,
      languages: ["sv", "ar", "en"]
    },
    {
      name: "Rättshjälpsmyndigheten",
      type: "legal_aid",
      description: "Statlig rättshjälp för ekonomiskt utsatta",
      phone: "0771-98 98 00",
      website: "https://rattshjalpsmyndigheten.se",
      specialization: ["legal_aid", "court_representation"],
      free_service: true, // Income-based
      languages: ["sv"]
    }
  ];

  static getContactsForSpecialization(specialization: string): LegalContact[] {
    return this.CONTACTS.filter(contact => 
      contact.specialization?.includes(specialization)
    );
  }

  static getContactsByType(type: LegalContact['type']): LegalContact[] {
    return this.CONTACTS.filter(contact => contact.type === type);
  }

  static getFreeServices(): LegalContact[] {
    return this.CONTACTS.filter(contact => contact.free_service);
  }

  static searchContacts(query: string): LegalContact[] {
    const searchTerm = query.toLowerCase();
    return this.CONTACTS.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.description.toLowerCase().includes(searchTerm) ||
      contact.specialization?.some(spec => spec.includes(searchTerm))
    );
  }

  static getEmergencyContacts(): LegalContact[] {
    return this.CONTACTS.filter(contact => 
      ['authority', 'ombudsman'].includes(contact.type) && 
      contact.phone
    );
  }

  static getAllContacts(): LegalContact[] {
    return [...this.CONTACTS];
  }
}

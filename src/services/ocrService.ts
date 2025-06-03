
export class OCRService {
  static async extractTextFromPDF(file: File): Promise<string> {
    // For now, simulate OCR extraction - in production this would use a service like Tesseract.js
    console.log('Extracting text from PDF:', file.name);
    
    // Simulate text extraction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock extracted text for demo purposes
    return `Extraherad text från ${file.name}:
    
Detta är ett uppsägningsbrev från hyresvärd till hyresgäst daterat 2024-01-15.

Grund för uppsägning: Störning enligt 12 kap 46§ Jordabalken
Uppsägningstid: 3 månader från delgivning
Avflyttningsdatum: 2024-04-15

Hyresgästen har rätt att bestrida denna uppsägning inom 6 veckor genom ansökan till hyresnämnden.

Kontakt: Hyresgästföreningen 08-123 456 78
Juridisk rådgivning: www.hyresgastforeningen.se

Viktigt: Agera snabbt för att bevara dina rättigheter.`;
  }

  static async extractTextFromImage(file: File): Promise<string> {
    console.log('Extracting text from image:', file.name);
    
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return `Text extraherad från bild ${file.name}:
    
Inkassovarning från Collector Bank AB
Fordran: 15,750 kr
Förfallodatum: 2024-02-01
Dröjsmålsränta: 8.5% per år

Betalningsanmärkning registreras inom 10 dagar om betalning ej sker.

För att undvika betalningsanmärkning, kontakta oss omedelbart på 0771-88 00 00.

Möjlighet till avbetalning finns. Skuldsanering kan vara aktuellt enligt skuldsaneringslagen.`;
  }

  static async processDocument(file: File): Promise<string> {
    const fileType = file.type;
    
    if (fileType.includes('pdf')) {
      return this.extractTextFromPDF(file);
    } else if (fileType.includes('image')) {
      return this.extractTextFromImage(file);
    } else if (fileType.includes('word') || fileType.includes('document')) {
      // Simulate Word document processing
      console.log('Processing Word document:', file.name);
      await new Promise(resolve => setTimeout(resolve, 800));
      return `Extraherad text från Word-dokument ${file.name}:\n\nAnställningsavtal mellan [Arbetsgivare] och [Arbetstagare]\nTjänst: Utvecklare\nLön: 45,000 kr/månad\nAnställningsform: Tillsvidare\nProvanställning: 6 månader\nUppsägningstid: 3 månader\n\nAnställningen regleras av kollektivavtal för IT-branschen.`;
    }
    
    return `Kunde inte extrahera text från fil av typ: ${fileType}`;
  }
}

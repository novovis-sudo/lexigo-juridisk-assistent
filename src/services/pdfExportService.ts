
export interface PDFExportOptions {
  title: string;
  content: string;
  metadata?: {
    author?: string;
    subject?: string;
    keywords?: string;
  };
  format?: 'A4' | 'letter';
  includeHeader?: boolean;
  includeFooter?: boolean;
}

export class PDFExportService {
  static async exportToPDF(options: PDFExportOptions): Promise<Blob> {
    console.log('Generating PDF export for:', options.title);
    
    // In a real implementation, this would use libraries like jsPDF or PDFKit
    // For now, we'll create a simple HTML-to-PDF simulation
    
    const htmlContent = this.generateHTMLContent(options);
    const pdfBlob = await this.convertHTMLToPDF(htmlContent);
    
    return pdfBlob;
  }

  private static generateHTMLContent(options: PDFExportOptions): string {
    const currentDate = new Date().toLocaleDateString('sv-SE');
    
    return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${options.title}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          margin: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2c3e50;
          margin: 0;
        }
        .header .subtitle {
          color: #7f8c8d;
          font-style: italic;
          margin-top: 5px;
        }
        .content {
          text-align: justify;
          margin-bottom: 30px;
        }
        .content h2 {
          color: #2c3e50;
          border-left: 4px solid #3498db;
          padding-left: 15px;
          margin-top: 30px;
        }
        .content h3 {
          color: #34495e;
          margin-top: 25px;
        }
        .legal-note {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          padding: 20px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .footer {
          border-top: 1px solid #bdc3c7;
          padding-top: 20px;
          margin-top: 40px;
          font-size: 12px;
          color: #7f8c8d;
          text-align: center;
        }
        .metadata {
          background-color: #ecf0f1;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        .metadata table {
          width: 100%;
          border-collapse: collapse;
        }
        .metadata td {
          padding: 5px;
          border-bottom: 1px solid #bdc3c7;
        }
        .metadata td:first-child {
          font-weight: bold;
          width: 120px;
        }
        ul, ol {
          margin-left: 20px;
        }
        li {
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      ${options.includeHeader !== false ? this.generateHeader(options) : ''}
      
      <div class="metadata">
        <table>
          <tr>
            <td>Genererad:</td>
            <td>${currentDate}</td>
          </tr>
          <tr>
            <td>Källa:</td>
            <td>Lexigo - AI Juridisk Assistent</td>
          </tr>
          ${options.metadata?.subject ? `
          <tr>
            <td>Ämne:</td>
            <td>${options.metadata.subject}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <div class="content">
        ${this.formatContent(options.content)}
      </div>

      <div class="legal-note">
        <h3>⚖️ Juridisk ansvarsfriskrivning</h3>
        <p>Detta dokument är genererat av Lexigo AI och utgör <strong>inte</strong> professionell juridisk rådgivning. 
        Informationen är avsedd som vägledning och bör alltid kompletteras med rådgivning från kvalificerad jurist. 
        Lexigo ansvarar inte för eventuella konsekvenser av att följa råden i detta dokument.</p>
        
        <p><strong>Rekommendation:</strong> Kontakta alltid en behörig jurist eller relevant rådgivningsorganisation 
        för professionell bedömning av din specifika situation.</p>
      </div>

      ${options.includeFooter !== false ? this.generateFooter() : ''}
    </body>
    </html>
    `;
  }

  private static generateHeader(options: PDFExportOptions): string {
    return `
    <div class="header">
      <h1>${options.title}</h1>
      <div class="subtitle">Genererat av Lexigo AI Juridisk Assistent</div>
    </div>
    `;
  }

  private static formatContent(content: string): string {
    // Convert markdown-like formatting to HTML
    let formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Handle lists
    formattedContent = formattedContent
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

    return `<p>${formattedContent}</p>`;
  }

  private static generateFooter(): string {
    const currentDate = new Date().toLocaleDateString('sv-SE');
    const currentTime = new Date().toLocaleTimeString('sv-SE');
    
    return `
    <div class="footer">
      <p>Dokument genererat ${currentDate} ${currentTime} | Lexigo AI Juridisk Assistent</p>
      <p>För senaste version och uppdateringar, besök lexigo.se</p>
    </div>
    `;
  }

  private static async convertHTMLToPDF(htmlContent: string): Promise<Blob> {
    // In a real implementation, this would use a proper HTML-to-PDF converter
    // For now, we'll simulate by creating a blob with the HTML content
    // that can be opened in a browser and printed to PDF
    
    console.log('Converting HTML to PDF...');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    return blob;
  }

  static downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async exportLegalAnalysis(
    analysis: any, 
    documentTitle: string = 'Juridisk Analys'
  ): Promise<Blob> {
    const content = this.formatLegalAnalysisContent(analysis);
    
    return this.exportToPDF({
      title: documentTitle,
      content,
      metadata: {
        subject: 'Juridisk dokumentanalys',
        keywords: 'juridik, analys, svensk rätt'
      }
    });
  }

  private static formatLegalAnalysisContent(analysis: any): string {
    return `
# Sammanfattning
${analysis.summary || 'Ingen sammanfattning tillgänglig'}

## Viktiga punkter
${analysis.key_points?.map((point: string) => `- ${point}`).join('\n') || 'Inga specifika punkter identifierade'}

## Identifierade juridiska frågor
${analysis.legal_issues?.map((issue: any) => `
### ${issue.title}
**Beskrivning:** ${issue.description}
**Allvarlighetsgrad:** ${issue.severity}
**Rättslig grund:** ${issue.legal_basis?.join(', ') || 'Ej specificerad'}
`).join('\n') || 'Inga specifika juridiska frågor identifierade'}

## Rekommendationer
${analysis.recommendations?.map((rec: any, index: number) => `
${index + 1}. **${rec.action}**
   - Motivering: ${rec.rationale}
   - Tidsram: ${rec.timeline}
   - Framgångssannolikhet: ${Math.round((rec.success_probability || 0) * 100)}%
`).join('\n') || 'Inga specifika rekommendationer'}

## Nästa steg
${analysis.next_steps?.map((step: any, index: number) => `
${index + 1}. **${step.step}**
   - ${step.description}
   - Prioritet: ${step.priority}
`).join('\n') || 'Inga specifika steg identifierade'}

## Juridiska referenser
${analysis.references?.map((ref: any) => `
- **${ref.law_name} ${ref.section}**: ${ref.description}
  Relevans: ${Math.round((ref.relevance_score || 0) * 100)}%
`).join('\n') || 'Inga specifika juridiska referenser'}

## Akuthetsbedömning
**Nivå:** ${analysis.urgency_assessment?.level || 'Ej bedömd'}
**Motivering:** ${analysis.urgency_assessment?.reasoning || 'Ingen motivering tillgänglig'}

${analysis.urgency_assessment?.time_sensitive_actions?.length > 0 ? `
**Tidskänsliga åtgärder:**
${analysis.urgency_assessment.time_sensitive_actions.map((action: string) => `- ${action}`).join('\n')}
` : ''}
    `;
  }
}

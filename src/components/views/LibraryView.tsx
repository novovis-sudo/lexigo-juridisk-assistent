
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Plus, BookOpen, Globe, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LegalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  type: 'official' | 'user-added';
}

const officialResources: LegalResource[] = [
  {
    id: '1',
    title: 'Domstolsverket',
    description: 'Sveriges officiella domstolswebbplats med information om rättegångar, domar och juridiska processer.',
    url: 'https://www.domstol.se',
    category: 'Domstolar',
    type: 'official'
  },
  {
    id: '2',
    title: 'Hyresgästföreningen',
    description: 'Hjälp och rådgivning för hyresgäster, information om hyresrätt och hyrestvister.',
    url: 'https://www.hyresgastforeningen.se',
    category: 'Hyresrätt',
    type: 'official'
  },
  {
    id: '3',
    title: 'Konsumentverket',
    description: 'Myndighet för konsumentfrågor, reklamationer och konsumenträttigheter.',
    url: 'https://www.konsumentverket.se',
    category: 'Konsumenträtt',
    type: 'official'
  },
  {
    id: '4',
    title: 'Försäkringskassan',
    description: 'Information om socialförsäkringar, sjukpenning, föräldrapenning och andra bidrag.',
    url: 'https://www.forsakringskassan.se',
    category: 'Socialförsäkring',
    type: 'official'
  },
  {
    id: '5',
    title: 'Kronofogdemyndigheten',
    description: 'Myndighet för indrivning av skulder och verkställighet av domar.',
    url: 'https://www.kronofogden.se',
    category: 'Skuld & Indrivning',
    type: 'official'
  }
];

const LibraryView = () => {
  const [userResources, setUserResources] = useState<LegalResource[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    category: ''
  });
  const { toast } = useToast();

  const handleAddResource = () => {
    if (!newResource.title || !newResource.url) {
      toast({
        title: "Ofullständig information",
        description: "Vänligen fyll i minst titel och URL.",
        variant: "destructive"
      });
      return;
    }

    const resource: LegalResource = {
      id: Date.now().toString(),
      ...newResource,
      type: 'user-added'
    };

    setUserResources([...userResources, resource]);
    setNewResource({ title: '', description: '', url: '', category: '' });
    setShowAddForm(false);

    toast({
      title: "Resurs tillagd",
      description: "Din juridiska resurs har lagts till i biblioteket."
    });
  };

  const allResources = [...officialResources, ...userResources];
  const categories = [...new Set(allResources.map(r => r.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-50 via-parchment-100 to-parchment-200 relative">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-30 wood-texture pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12 space-y-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl mb-6 shadow-gold-glow">
            <BookOpen className="h-8 w-8 text-ebony-950" />
          </div>
          <h2 className="text-4xl font-serif font-semibold text-ebony-950 mb-4 tracking-tight">
            Juridiskt Bibliotek
          </h2>
          <p className="text-lg text-charcoal-600 font-legal max-w-2xl mx-auto">
            Användbara juridiska länkar och resurser för svenska rättsprocesser
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-serif font-medium text-ebony-950">Resurser</h3>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="premium-button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Lägg till resurs
          </Button>
        </div>

        {showAddForm && (
          <Card className="premium-card p-8 mb-8 border-l-4 border-l-gold-600">
            <h4 className="text-xl font-serif font-semibold text-ebony-950 mb-6">
              Lägg till ny juridisk resurs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Titel
                </label>
                <Input
                  placeholder="Titel på resursen"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  className="premium-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Kategori
                </label>
                <Input
                  placeholder="Kategori (t.ex. Familjerätt)"
                  value={newResource.category}
                  onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                  className="premium-input"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                URL
              </label>
              <Input
                placeholder="URL (https://...)"
                value={newResource.url}
                onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                className="premium-input"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Beskrivning
              </label>
              <Textarea
                placeholder="Beskrivning av resursen (valfritt)"
                value={newResource.description}
                onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                rows={3}
                className="premium-input"
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleAddResource} className="premium-button">
                Lägg till
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="border-charcoal-300 text-charcoal-700 hover:bg-parchment-200"
              >
                Avbryt
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-10">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-xl font-serif font-medium text-gold-700 border-b border-gold-200 pb-2 mb-6">
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allResources
                  .filter(resource => resource.category === category)
                  .map(resource => (
                    <Card key={resource.id} className="premium-card hover:shadow-premium-lg transition-shadow duration-300 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-serif font-medium text-lg text-ebony-950">
                          {resource.title}
                        </h5>
                        {resource.type === 'official' && (
                          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                            Officiell
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-charcoal-600 mb-4 font-legal line-clamp-3">
                        {resource.description}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => window.open(resource.url, '_blank')}
                        className="w-full border-gold-200 text-gold-800 hover:bg-gold-50"
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Besök webbplats
                      </Button>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <Card className="premium-card p-8 bg-ebony-950 text-parchment-100 mt-12">
          <h4 className="text-xl font-serif font-semibold text-gold-500 mb-6 flex items-center">
            <Phone className="mr-3 h-5 w-5 text-gold-500" />
            Viktiga kontakter
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-legal">
            <div className="border-l-2 border-gold-600 pl-6">
              <p className="font-medium text-gold-300 mb-2">Juridisk rådgivning:</p>
              <p className="mb-1">Juristjouren: 08-692 45 00</p>
              <p>Hyresgästföreningen: Lokala föreningar</p>
            </div>
            <div className="border-l-2 border-gold-600 pl-6">
              <p className="font-medium text-gold-300 mb-2">Akuta ärenden:</p>
              <p className="mb-1">Polis: 112 (vid brott)</p>
              <p>Kronofogden: 0771-99 99 00</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LibraryView;

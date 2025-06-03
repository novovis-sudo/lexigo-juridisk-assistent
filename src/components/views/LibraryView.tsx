
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
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Juridiskt Bibliotek</h2>
        <p className="text-gray-600">
          Användbara juridiska länkar och resurser för svenska rättsprocesser
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Resurser</h3>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Lägg till resurs
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6 mb-6 border-green-200">
          <h4 className="font-semibold mb-4">Lägg till ny juridisk resurs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Titel på resursen"
              value={newResource.title}
              onChange={(e) => setNewResource({...newResource, title: e.target.value})}
            />
            <Input
              placeholder="Kategori (t.ex. Familjerätt)"
              value={newResource.category}
              onChange={(e) => setNewResource({...newResource, category: e.target.value})}
            />
          </div>
          <Input
            placeholder="URL (https://...)"
            value={newResource.url}
            onChange={(e) => setNewResource({...newResource, url: e.target.value})}
            className="mb-4"
          />
          <Textarea
            placeholder="Beskrivning av resursen (valfritt)"
            value={newResource.description}
            onChange={(e) => setNewResource({...newResource, description: e.target.value})}
            rows={3}
            className="mb-4"
          />
          <div className="flex gap-2">
            <Button onClick={handleAddResource}>
              Lägg till
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Avbryt
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h4 className="text-lg font-semibold mb-3 text-blue-600">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allResources
                .filter(resource => resource.category === category)
                .map(resource => (
                  <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{resource.title}</h5>
                      <div className="flex items-center gap-1">
                        {resource.type === 'official' && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Officiell
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {resource.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(resource.url, '_blank')}
                      className="w-full"
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

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-semibold mb-3 flex items-center">
          <Phone className="mr-2 h-5 w-5 text-blue-600" />
          Viktiga kontakter
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Juridisk rådgivning:</p>
            <p>Juristjouren: 08-692 45 00</p>
            <p>Hyresgästföreningen: Lokala föreningar</p>
          </div>
          <div>
            <p className="font-medium">Akuta ärenden:</p>
            <p>Polis: 112 (vid brott)</p>
            <p>Kronofogden: 0771-99 99 00</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LibraryView;

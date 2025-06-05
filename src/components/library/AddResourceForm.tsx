
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LegalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  type: 'official' | 'user-added';
}

interface AddResourceFormProps {
  onAddResource: (resource: Omit<LegalResource, 'id' | 'type'>) => void;
}

const AddResourceForm = ({ onAddResource }: AddResourceFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    category: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newResource.title || !newResource.url) {
      toast({
        title: "Ofullständig information",
        description: "Vänligen fyll i minst titel och URL.",
        variant: "destructive"
      });
      return;
    }

    onAddResource(newResource);
    setNewResource({ title: '', description: '', url: '', category: '' });
    setShowForm(false);

    toast({
      title: "Resurs tillagd",
      description: "Din juridiska resurs har lagts till i biblioteket."
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-serif font-medium text-ebony-950">Resurser</h3>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="premium-button"
        >
          <Plus className="mr-2 h-4 w-4" />
          Lägg till resurs
        </Button>
      </div>

      {showForm && (
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
            <Button onClick={handleSubmit} className="premium-button">
              Lägg till
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
              className="border-charcoal-300 text-charcoal-700 hover:bg-parchment-200"
            >
              Avbryt
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default AddResourceForm;

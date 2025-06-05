
import React from 'react';
import { Card } from '@/components/ui/card';
import { Phone } from 'lucide-react';

const ContactsSection = () => {
  return (
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
  );
};

export default ContactsSection;

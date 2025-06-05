
import React from 'react';
import { Card } from '@/components/ui/card';
import { Phone } from 'lucide-react';

const ContactsSection = () => {
  return (
    <Card className="premium-card p-10 bg-[#0f0f11] border-accent-500/20 mt-16">
      <h4 className="text-2xl font-serif font-semibold text-white mb-8 flex items-center">
        <Phone className="mr-4 h-6 w-6 text-accent-400" />
        Viktiga kontakter
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
        <div className="border-l-2 border-accent-600 pl-8">
          <p className="font-medium text-accent-300 mb-3 text-lg">Juridisk rådgivning:</p>
          <p className="mb-2 text-dark-200">Juristjouren: 08-692 45 00</p>
          <p className="text-dark-200">Hyresgästföreningen: Lokala föreningar</p>
        </div>
        <div className="border-l-2 border-accent-600 pl-8">
          <p className="font-medium text-accent-300 mb-3 text-lg">Akuta ärenden:</p>
          <p className="mb-2 text-dark-200">Polis: 112 (vid brott)</p>
          <p className="text-dark-200">Kronofogden: 0771-99 99 00</p>
        </div>
      </div>
    </Card>
  );
};

export default ContactsSection;

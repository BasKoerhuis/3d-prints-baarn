import { SiteConfig, AboutContent, FAQItem } from '@/types';

export const siteConfig: SiteConfig = {
  siteName: '3D Prints Baarn',
  tagline: 'Creatieve 3D prints gemaakt met passie',
  orderEmail: process.env.ORDER_EMAIL || 'jeltevveen@gmail.com',
  accentColor: '#007AFF', // Apple-blue
  dropoffLocations: [
    'Thuis in Baarn',
    'Schoolplein',
    'Sportvereniging',
    'Anders (zie opmerkingen)'
  ]
};

export const aboutContent: AboutContent = {
  title: 'Over Mij',
  makerName: 'Jelte',
  makerAge: 12,
  content: `
    Hoi! Ik ben Jelte, 12 jaar oud, en ik ben gek op 3D printen. Wat begon als een hobby is 
    uitgegroeid tot mijn eigen kleine bedrijf: 3D Prints Baarn.
    
    Met mijn 3D printer maak ik allerlei coole dingen - van speelgoed tot handige gadgets. 
    Elk product wordt met zorg en precisie gemaakt. Ik vind het geweldig om nieuwe designs 
    te ontdekken en te zien hoe iets van een idee op het scherm verandert in een echt object.
    
    Alle bestellingen worden door mij persoonlijk geprint en gecontroleerd voordat ze worden 
    afgeleverd. Heb je een speciaal verzoek of een eigen idee? Laat het me weten!
  `
};

export const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Hoe lang duurt het voordat mijn bestelling klaar is?',
    answer: 'De meeste producten zijn binnen 3-5 dagen klaar. Grotere of complexe prints kunnen iets langer duren. Ik houd je op de hoogte!',
    order: 1
  },
  {
    id: '2',
    question: 'Welk materiaal gebruik je?',
    answer: 'Ik gebruik PLA plastic, dat is een milieuvriendelijk materiaal gemaakt van plantaardig materiaal. Het is stevig, veilig en beschikbaar in veel kleuren.',
    order: 2
  },
  {
    id: '3',
    question: 'Kan ik een speciale kleur kiezen?',
    answer: 'Ja! Ik heb verschillende kleuren beschikbaar. Vermeld je kleurwens in de opmerkingen bij je bestelling.',
    order: 3
  },
  {
    id: '4',
    question: 'Wat als mijn print kapot gaat?',
    answer: 'Als er iets mis is met je print bij aflevering, kun je contact opnemen en dan zoeken we samen naar een oplossing.',
    order: 4
  },
  {
    id: '5',
    question: 'Kan ik ook mijn eigen design laten printen?',
    answer: 'Dat hangt ervan af! Stuur me een bericht met je idee, dan kijk ik of het mogelijk is. Simpele designs zijn meestal geen probleem.',
    order: 5
  },
  {
    id: '6',
    question: 'Hoe betaal ik?',
    answer: 'Betaling kan contant bij aflevering of via tikkie. We spreken dit af nadat je je bestelling hebt geplaatst.',
    order: 6
  }
];

export const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Winkel', href: '/winkel' },
  { name: 'Galerij', href: '/galerij' },
  { name: 'Over Mij', href: '/over' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' }
];

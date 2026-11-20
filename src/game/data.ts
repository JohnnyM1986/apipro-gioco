// Contenuti del gioco: specie (dal catalogo di ApiPRO Fioriture), stagioni/livelli, curiosità.

export interface Species {
  id: string
  name: string        // nome per bambini
  scientific: string
  color: number       // colore guida (particelle, petali)
  fact: string        // curiosità mostrata a fine livello
}

export const SPECIES: Record<string, Species> = {
  tarassaco: { id: 'tarassaco', name: 'Tarassaco', scientific: 'Taraxacum officinale', color: 0xf7c531,
    fact: 'Il tarassaco è tra i primi fiori della primavera: per le api è una colazione preziosa dopo il lungo inverno.' },
  colza: { id: 'colza', name: 'Colza', scientific: 'Brassica napus', color: 0xf5d332,
    fact: 'I campi di colza in fiore diventano gialli come il sole. Il loro miele è chiaro e diventa cremoso.' },
  robinia: { id: 'robinia', name: 'Acacia', scientific: 'Robinia pseudoacacia', color: 0xfffef6,
    fact: 'Dai grappoli bianchi dell’acacia nasce il miele di acacia: chiarissimo e liquido per tanto tempo.' },
  castagno: { id: 'castagno', name: 'Castagno', scientific: 'Castanea sativa', color: 0xe9c85a,
    fact: 'I fiori del castagno sono lunghi e gialli. Il miele di castagno è scuro e ha un gusto un po’ amaro.' },
  tiglio: { id: 'tiglio', name: 'Tiglio', scientific: 'Tilia spp.', color: 0xf2e48a,
    fact: 'I fiori del tiglio profumano tantissimo: in estate le api li cercano lungo i viali e i filari.' },
  amorfa: { id: 'amorfa', name: 'Amorfa', scientific: 'Amorpha fruticosa', color: 0x7b4e9e,
    fact: 'L’amorfa ha spighe viola con tanti puntini arancioni: sono le antere, piene di polline.' },
  rododendro: { id: 'rododendro', name: 'Rododendro', scientific: 'Rhododendron spp.', color: 0xe0628a,
    fact: 'In montagna fiorisce il rododendro: le api ne fanno un miele raro e delicato.' },
  girasole: { id: 'girasole', name: 'Girasole', scientific: 'Helianthus annuus', color: 0xf4b400,
    fact: 'Il girasole è fatto di tantissimi fiorellini insieme! Il suo miele è giallo oro.' },
  limonio: { id: 'limonio', name: 'Limonio', scientific: 'Limonium narbonense', color: 0xa99bd6,
    fact: 'Il limonio, la “fiorella di barena”, colora di lilla le barene della laguna a fine estate.' },
  astro_marino: { id: 'astro_marino', name: 'Astro marino', scientific: 'Tripolium pannonicum', color: 0xb7a6e0,
    fact: 'L’astro marino cresce vicino al mare, in barena: le api volano fin lì a cercare nettare.' },
  edera: { id: 'edera', name: 'Edera', scientific: 'Hedera helix', color: 0xb9c46a,
    fact: 'L’edera fiorisce in autunno, quando quasi tutti gli altri fiori sono finiti: è l’ultima scorta prima dell’inverno.' }
}

export interface Level {
  id: number
  season: string
  subtitle: string
  flowers: string[]
  target: number       // gocce di nettare da portare all'arnia
  time: number         // secondi
  hornets: number      // calabroni
  hornetSpeed: number
  smog: number         // nuvole di pesticida
  slots: number        // fiori contemporanei
  sky: [number, number]
  hills: [number, number, number]
  ground: number
  water?: boolean
  leaves?: boolean
  tip: string          // consiglio mostrato nella scheda iniziale
}

export const LEVELS: Level[] = [
  { id: 1, season: 'Primavera', subtitle: 'Il risveglio dei prati', flowers: ['tarassaco', 'colza', 'robinia'],
    target: 10, time: 75, hornets: 0, hornetSpeed: 0, smog: 0, slots: 6,
    sky: [0x9fd8f5, 0xe8f6fb], hills: [0xb7dc8a, 0x8fc364, 0x6fa84a], ground: 0x5d9a3c,
    tip: 'Tocca lo schermo e guida l’ape. Fermati sui fiori che brillano per raccogliere il nettare, poi portalo all’arnia!' },
  { id: 2, season: 'Inizio estate', subtitle: 'Boschi e filari in fiore', flowers: ['castagno', 'tiglio', 'amorfa', 'rododendro'],
    target: 12, time: 80, hornets: 1, hornetSpeed: 85, smog: 0, slots: 7,
    sky: [0x7cc7f0, 0xdff2fb], hills: [0x9cc56e, 0x6fa64a, 0x4f8a34], ground: 0x4a7f2f,
    tip: 'Attenzione al calabrone asiatico! Se ti tocca, perdi il nettare che stai portando.' },
  { id: 3, season: 'Estate', subtitle: 'Campi d’oro e laguna', flowers: ['girasole', 'limonio', 'astro_marino'],
    target: 14, time: 85, hornets: 1, hornetSpeed: 100, smog: 1, slots: 7,
    sky: [0x69b9ea, 0xfdf0cf], hills: [0xd9c46a, 0xc2a94a, 0x9aa04a], ground: 0x8c9a3e, water: true,
    tip: 'Evita la nuvola di pesticida: fa girare la testa all’ape e la rallenta.' },
  { id: 4, season: 'Autunno', subtitle: 'L’ultima scorta dell’edera', flowers: ['edera', 'astro_marino'],
    target: 14, time: 85, hornets: 2, hornetSpeed: 95, smog: 1, slots: 6,
    sky: [0xf3c99a, 0xfcefdc], hills: [0xd8a35a, 0xc0803e, 0x8f6a35], ground: 0x7a6a35, leaves: true,
    tip: 'In autunno i fiori sono pochi: l’edera è preziosa! Prepara le scorte per l’inverno.' }
]

// Curiosità generali, una per fine livello in aggiunta a quella della specie
export const BEE_FACTS = [
  'Le api che raccolgono nettare e polline si chiamano bottinatrici: visitano tantissimi fiori ogni giorno.',
  'Quando trova un bel prato fiorito, l’ape torna all’arnia e fa una danza per indicare la strada alle compagne.',
  'I pesticidi possono far male alle api: un prato pulito e fiorito le aiuta a stare bene.',
  'Il calabrone asiatico (Vespa velutina) caccia le api davanti all’arnia: gli apicoltori le proteggono.'
]

// Fasi della fioritura (scala F0–F5 del protocollo ApiPRO), semplificate per il gioco
export const PHASE_NAMES = ['Boccio', 'Primi fiori', 'In aumento', 'Piena fioritura', 'Sta appassendo', 'Finita']

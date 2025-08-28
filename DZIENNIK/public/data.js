const AppData = {
  quotes: [
    "Każdy dzień to nowa szansa na rozwój. Wykorzystaj ją.",
    "Małe kroki każdego dnia prowadzą do wielkich rezultatów.",
    "Twoja przyszłość jest tworzona przez to, co robisz dzisiaj, a nie jutro."
  ],
  initialQuestions: { 
    poranek: [
        {id:'p1',text:'Za co jestem dziś wdzięczny/a?'},
        {id:'p2',text:'Co sprawi, że ten dzień będzie wspaniały?'},
        {id:'p3',text:'Moja dzisiejsza afirmacja:'}
    ], 
    wieczor: [
        {id:'w1',text:'3 niesamowite rzeczy, które się dzisiaj wydarzyły:'},
        {id:'w2',text:'Czego się dzisiaj nauczyłem/am?'},
        {id:'w3',text:'Jak mogłem/am uczynić ten dzień jeszcze lepszym?'}
    ] 
  },
  initialHabits: ['Medytacja', 'Ćwiczenia', 'Czytanie'],
  initialSentimentQuestions: [
    {id:'mood', question:'Jak oceniasz swój nastrój?'}, 
    {id:'energy', question:'Jak oceniasz swoją energię?'}, 
    {id:'productivity', question:'Jak oceniasz swoją produktywność?'}
  ]
};

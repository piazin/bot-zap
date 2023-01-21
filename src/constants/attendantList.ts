export const attendantList = [
  {
    title: 'Atendentes disponiveis 🧑‍💻',
    rows: [
      {
        title: 'Andrey',
        description: 'Suporte de infraestrutura',
      },
      {
        title: 'Sergio',
        description: 'Suporte de Sistemas (Senior/SE Suite)',
      },
      {
        title: 'Hernando',
        description: 'Suporte de Sistemas (SAP/Frontiline)',
      },
    ],
  },
];

interface IAttendantPhoneNumber {
  Andrey: {
    number: string;
  };
  Sergio: {
    number: string;
  };
  Hernando: {
    number: string;
  };
}

export const attendantsPhoneNumber = [
  {
    name: 'Andrey',
    number: '554391850807@c.us',
  },
  {
    name: 'Sergio',
    number: '554396638833@c.us',
  },
  {
    name: 'Hernando',
    number: '554391208707@c.us',
  },
];

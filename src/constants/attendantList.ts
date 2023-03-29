export const attendantList = `
Atendentes disponiveis 🧑‍💻

1 - Lucas (Suporte de Infraestrutura)
2 - Sergio (Suporte de Sistemas Senior/SE Suite)
3 - Hernando (Suporte de Sistemas SAP/Frontline)
`;

export interface IAttendantsPhoneNumber {
  id: string;
  name: string;
  number: string;
}

export const attendantsPhoneNumber: IAttendantsPhoneNumber[] = [
  {
    id: '1',
    name: 'Lucas',
    number: '554391208707@c.us',
  },
  {
    id: '2',
    name: 'Sergio',
    number: '554396638833@c.us',
  },
  {
    id: '3',
    name: 'Hernando',
    number: '554399578877@c.us',
  },
];

export const attendantList = `
Atendentes disponiveis 🧑‍💻

  Andrey (Suporte de Infraestrutura)
  Sergio (Suporte de Sistemas Senior/SE Suite)
  Hernando (Suporte de Sistemas SAP/Frontline)

Com qual deseja falar?`;

export interface IAttendantsPhoneNumber {
  id: string;
  name: string;
  number: string;
}

export const attendantsPhoneNumber: IAttendantsPhoneNumber[] = [
  {
    id: '1',
    name: 'Andrey',
    number: '554391850807@c.us',
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

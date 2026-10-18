// Модельдегі 5 құзырет. Кілттер базада сақталады — оларды өзгертпеңіз.
export const COMPETENCIES = [
  { key: 'digital', label: 'Цифрлық дағдылар (AI & VR)', short: 'Цифрлық' },
  { key: 'critical', label: 'Тарихи-сыни талдау', short: 'Сыни талдау' },
  { key: 'method', label: 'Инновациялық әдістеме', short: 'Әдістеме' },
  { key: 'comm', label: 'Коммуникациялық дағды', short: 'Коммуникация' },
  { key: 'management', label: 'Педагогикалық менеджмент', short: 'Менеджмент' },
];

export const competencyLabel = (key) =>
  COMPETENCIES.find((c) => c.key === key)?.label ?? key;

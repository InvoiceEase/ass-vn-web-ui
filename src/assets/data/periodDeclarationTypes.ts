/* eslint-disable consistent-return */
export const periodDeclarationTypes = [
  { id: 1, label: 'Tháng' },
  { id: 3, label: 'Quý' },
];

export const getPeriodDeclarationTypeLabel = (id: string): string => {
  periodDeclarationTypes.every((item) => {
    if (item.id === +id) {
      return item.label;
    }
  });
  return '';
};

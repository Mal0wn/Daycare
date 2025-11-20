import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Child } from '../../types';
import { InventoryForm } from './InventoryForm';

const childOptions: Child[] = [
  {
    id: 'child-1',
    firstName: 'Léa',
    lastName: 'Dupont',
    birthDate: '2021-05-05',
    ageGroup: 'Bébés',
    attendancePattern: 'Lun-Mar'
  }
];

const getFieldByLabel = (label: string) => screen.getByText(label).closest('.form-field') as HTMLElement;
const getInputElement = (label: string) => getFieldByLabel(label).querySelector('input') as HTMLInputElement;

describe('InventoryForm', () => {
  it('shows validation errors when submitting empty form', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<InventoryForm childrenOptions={childOptions} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /Ajouter l'entrée/i }));

    expect(await screen.findByText('Choisir un enfant')).toBeInTheDocument();
    expect(screen.getByText('Marque obligatoire')).toBeInTheDocument();
    expect(screen.getAllByText('Date requise')).toHaveLength(2);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits full payload and resets when creating a new entry', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<InventoryForm childrenOptions={childOptions} onSubmit={onSubmit} />);

    const childSelect = within(getFieldByLabel('Enfant')).getByRole('combobox');
    await user.selectOptions(childSelect, 'child-1');

    const typeSelect = within(getFieldByLabel('Type')).getByRole('combobox');
    await user.selectOptions(typeSelect, 'Lait maternel');

    const unitSelect = within(getFieldByLabel('Unité')).getByRole('combobox');
    await user.selectOptions(unitSelect, 'ml');

    const brandInput = within(getFieldByLabel('Marque / description')).getByRole('textbox');
    await user.type(brandInput, 'Douceur Bio');

    const quantityInput = within(getFieldByLabel('Quantité')).getByRole('spinbutton');
    await user.clear(quantityInput);
    await user.type(quantityInput, '3');

    const dateReceivedInput = getInputElement("Date d'entrée");
    await user.type(dateReceivedInput, '2024-01-10');

    const expirationInput = getInputElement("Date d'expiration");
    await user.type(expirationInput, '2024-02-01');

    const notesField = within(getFieldByLabel('Notes')).getByRole('textbox');
    await user.type(notesField, 'À conserver au frais');

    await user.click(screen.getByRole('button', { name: /Ajouter l'entrée/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        childId: 'child-1',
        type: 'Lait maternel',
        brand: 'Douceur Bio',
        quantity: 3,
        unit: 'ml',
        dateReceived: '2024-01-10',
        expirationDate: '2024-02-01',
        notes: 'À conserver au frais'
      })
    );

    expect(brandInput).toHaveValue('');
    expect(notesField).toHaveValue('');
  });
});

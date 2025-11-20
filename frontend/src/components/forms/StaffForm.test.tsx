import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StaffForm } from './StaffForm';

const getFieldByLabel = (label: string) => screen.getByText(label).closest('.form-field') as HTMLElement;

describe('StaffForm', () => {
  it('requires a name and at least one schedule slot', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<StaffForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /Ajouter le membre/i }));

    expect(await screen.findByText('Champ requis')).toBeInTheDocument();
    expect(screen.getByText('Sélectionner au moins un créneau')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits staff payload with schedule selections', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<StaffForm onSubmit={onSubmit} />);

    const nameInput = within(getFieldByLabel('Nom')).getByRole('textbox');
    await user.type(nameInput, 'Emma');

    const roleSelect = within(getFieldByLabel('Rôle')).getByRole('combobox');
    await user.selectOptions(roleSelect, 'Animateur');

    const capacityInput = within(getFieldByLabel('Capacité max')).getByRole('spinbutton');
    await user.clear(capacityInput);
    await user.type(capacityInput, '8');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    await user.click(screen.getByRole('button', { name: /Ajouter le membre/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Emma',
          role: 'Animateur',
          maxChildrenCapacity: 8,
          schedule: expect.objectContaining({
            lundi: { morning: true, afternoon: true }
          })
        })
      )
    );

    expect(nameInput).toHaveValue('');
  });
});

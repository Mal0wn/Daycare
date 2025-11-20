import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActivityForm } from './ActivityForm';

const getFieldByLabel = (label: string) => screen.getByText(label).closest('.form-field') as HTMLElement;

describe('ActivityForm', () => {
  it('prevents submission when required fields are empty', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ActivityForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /Planifier l'activité/i }));

    expect(await screen.findByText('Nom requis')).toBeInTheDocument();
    expect(screen.getByText('Description requise')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits data with toggled groups and photos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ActivityForm onSubmit={onSubmit} />);

    const nameInput = within(getFieldByLabel("Nom de l'activité")).getByRole('textbox');
    const descriptionInput = within(getFieldByLabel('Description')).getByRole('textbox');
    await user.type(nameInput, 'Peinture sensorielle');
    await user.type(descriptionInput, 'Exploration des textures et couleurs');

    const daySelect = within(getFieldByLabel('Jour')).getByRole('combobox');
    await user.selectOptions(daySelect, 'mercredi');

    const maxInput = within(getFieldByLabel('Places')).getByRole('spinbutton');
    await user.clear(maxInput);
    await user.type(maxInput, '12');

    await user.click(screen.getByRole('button', { name: 'Bébés' }));
    await user.click(screen.getByRole('button', { name: 'Moyens' }));
    await user.click(screen.getByRole('button', { name: 'Tous' }));

    const photoInput = screen.getByPlaceholderText('URL de la photo');
    await user.type(photoInput, 'https://cdn/photo.jpg');
    await user.click(screen.getByRole('button', { name: 'Ajouter la photo' }));
    await user.click(screen.getByRole('button', { name: 'Retirer' }));

    await user.click(screen.getByRole('button', { name: /Planifier l'activité/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Peinture sensorielle',
        description: 'Exploration des textures et couleurs',
        weekday: 'mercredi',
        ageGroups: ['Moyens', 'Tous'],
        maxChildren: 12,
        pictures: []
      })
    );

    expect(nameInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });
});

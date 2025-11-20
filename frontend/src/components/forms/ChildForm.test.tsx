import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChildForm } from './ChildForm';

describe('ChildForm', () => {
  it('validates required fields before submitting', async () => {
    const onSubmit = vi.fn();
    render(<ChildForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /Ajouter un enfant/i }));

    expect(await screen.findAllByText('Champ requis')).toHaveLength(2);
    expect(screen.getByText('Date obligatoire')).toBeInTheDocument();
    expect(screen.getByText('Choisir au moins un jour')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits normalized payload when form is valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ChildForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Prénom'), 'Sam');
    await userEvent.type(screen.getByLabelText('Nom'), 'Doe');
    await userEvent.type(screen.getByLabelText('Date de naissance'), '2020-01-01');
    await userEvent.selectOptions(screen.getByLabelText("Groupe d'âge"), 'Moyens');
    await userEvent.click(screen.getByRole('button', { name: 'Lun' }));
    await userEvent.click(screen.getByRole('button', { name: 'Ven' }));

    await userEvent.click(screen.getByRole('button', { name: /Ajouter un enfant/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'Sam',
        lastName: 'Doe',
        birthDate: '2020-01-01',
        ageGroup: 'Moyens',
        attendancePattern: 'Lun-Ven'
      })
    );

    expect(screen.getByLabelText('Prénom')).toHaveValue('');
    expect(screen.getByLabelText('Nom')).toHaveValue('');
  });
});

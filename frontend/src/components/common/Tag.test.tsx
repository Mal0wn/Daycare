import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('applies the configured color for known groups', () => {
    render(<Tag label="Bébés" />);
    const tag = screen.getByText('Bébés');
    expect(tag).toHaveStyle({ backgroundColor: '#f6b2c0' });
  });

  it('falls back to border color for unknown label', () => {
    render(<Tag label="Autre" />);
    const tag = screen.getByText('Autre');
    expect(tag.style.backgroundColor).toBe('var(--border-color)');
  });
});

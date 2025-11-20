import { test, expect } from '@playwright/test';

const baseChildren = [
  {
    id: 'child-1',
    firstName: 'Léa',
    lastName: 'Dupont',
    birthDate: '2021-05-04',
    ageGroup: 'Bébés',
    attendancePattern: 'Lun-Mar-Jeu'
  },
  {
    id: 'child-2',
    firstName: 'Sasha',
    lastName: 'Moreau',
    birthDate: '2020-10-20',
    ageGroup: 'Moyens',
    attendancePattern: 'Mer-Jeu'
  }
];

test.describe('Gestion des enfants', () => {
  test.beforeEach(async ({ page }) => {
    let children = JSON.parse(JSON.stringify(baseChildren));

    await page.route('**/api/children', async (route) => {
      const { method, url } = route.request();
      if (method === 'GET') {
        return route.fulfill({ json: children });
      }
      if (method === 'POST') {
        const payload = await route.request().postDataJSON();
        const newChild = { id: `child-${children.length + 1}`, ...payload };
        children = [...children, newChild];
        return route.fulfill({ status: 201, json: newChild });
      }
      if (method === 'PUT') {
        const id = url.split('/').pop() || '';
        const payload = await route.request().postDataJSON();
        children = children.map((item) => (item.id === id ? { ...item, ...payload } : item));
        const updated = children.find((item) => item.id === id);
        return route.fulfill({ status: updated ? 200 : 404, json: updated || { message: 'Not found' } });
      }
      if (method === 'DELETE') {
        const id = url.split('/').pop();
        children = children.filter((child) => child.id !== id);
        return route.fulfill({ status: 204, body: '' });
      }
      return route.continue();
    });
  });

  test('affiche la liste et ajoute un enfant', async ({ page }) => {
    await page.goto('/enfants');
    await expect(page.getByRole('heading', { name: 'Enfants inscrits' })).toBeVisible();

    const cards = page.locator('.child-card');
    await expect(cards).toHaveCount(2);
    await expect(cards.first()).toContainText('Léa Dupont');

    await page.getByLabel('Prénom').fill('Noé');
    await page.getByLabel('Nom').fill('Martin');
    await page.getByLabel('Date de naissance').fill('2022-02-15');
    await page.getByLabel("Groupe d'âge").selectOption('Petits');
    await page.getByRole('button', { name: /^Lun$/ }).first().click();
    await page.getByRole('button', { name: /^Ven$/ }).first().click();
    await page.getByRole('button', { name: /Ajouter un enfant/i }).click();

    await expect(cards).toHaveCount(3);
    await expect(page.getByText('Noé Martin')).toBeVisible();

    const deleteButton = cards.first().locator('.ghost-btn').nth(1);
    await deleteButton.click();
    await expect(cards).toHaveCount(2);
  });
});

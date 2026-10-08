import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Button from './Button';
import Card from './Card';
import ConfirmationModal from './ConfirmationModal';
import ContactForm from './ContactForm';
import Navbar from './Navbar';
import Table from './Table';

describe('frontend components', () => {
  it('submits contact form values and clears the form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'Alex Rivera');
    await user.type(screen.getByLabelText(/email address/i), 'alex@example.com');
    await user.selectOptions(screen.getByLabelText(/subject/i), 'membership');
    await user.type(screen.getByLabelText(/message/i), 'Membership question');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      subject: 'membership',
      message: 'Membership question',
    });
    expect(screen.getByLabelText(/full name/i)).toHaveValue('');
  });

  it('renders a button and responds to clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders card content', () => {
    render(<Card title="Membership" subtitle="Join us">Details</Card>);
    expect(screen.getByRole('heading', { name: 'Membership' })).toBeInTheDocument();
    expect(screen.getByText('Join us')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders table headers and rows', () => {
    render(
      <Table
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Status', accessor: 'status' },
        ]}
        data={[{ name: 'Alex Rivera', status: 'Active' }]}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Alex Rivera' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Active' })).toBeInTheDocument();
  });

  it('calls the confirmation action', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmationModal
        isOpen
        message="Delete this item?"
        onConfirm={onConfirm}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Yes' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('opens and closes the mobile navigation menu', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/about']}><Navbar /></MemoryRouter>);

    expect(screen.getByRole('link', { name: 'About Us' })).toHaveClass('active');

    const toggle = screen.getByRole('button', { name: /toggle navigation menu/i });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('link', { name: 'Contact' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
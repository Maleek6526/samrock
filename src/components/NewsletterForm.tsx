'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { addSubscriber } from '@/lib/store';

/** Footer newsletter capture. Subscribers are stored locally and listed in the admin. */
export default function NewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const added = addSubscriber(email);

    if (added) {
      toast.success('You are subscribed. Welcome to the list.');
      setEmail('');
    } else {
      toast.info('That email is already on the list.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="name@example.com"
        className="field sm:flex-1"
      />
      <button type="submit" className="btn btn-primary shrink-0">
        <Send size={15} aria-hidden="true" /> Subscribe
      </button>
    </form>
  );
}

'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <Button type="button" variant="outline" onClick={handleSignOut}>
      Logout
    </Button>
  );
}

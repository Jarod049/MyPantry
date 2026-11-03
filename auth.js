/* Session lifecycle shared by the browser and the regression tests. */
(function (root) {
  'use strict';
  function createAuth(client, onSession, onError) {
    let revision = 0;
    let subscription;
    let current = null;
    let recovery = false;
    function apply(session, event) {
      current = session;
      if (!session) recovery = false;
      if (event === 'PASSWORD_RECOVERY') recovery = true;
      onSession(session, recovery ? 'PASSWORD_RECOVERY' : event);
    }
    return {
      async start() {
        subscription = client.auth.onAuthStateChange((event, session) => {
          // An update completing after sign-out must not restore the old account.
          if (event === 'USER_UPDATED' && current?.user?.id !== session?.user?.id) return;
          if (event === 'PASSWORD_RECOVERY') recovery = true;
          // Do not call other Supabase methods while its auth callback holds a lock.
          const version = ++revision;
          setTimeout(() => { if (version === revision) apply(session, event); }, 0);
        }).data.subscription;
        const version = revision;
        try {
          const { data, error } = await client.auth.getSession();
          if (version !== revision) return;
          if (error) throw error;
          apply(data.session, 'INITIAL_SESSION');
        } catch (error) { if (version === revision) onError(error); }
      },
      async signIn(email, password) {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        ++revision;
        recovery = false;
        apply(data.session, 'SIGNED_IN');
      },
      async signUp(email, password, name, redirectTo) {
        const { data, error } = await client.auth.signUp({ email, password,
          options: { data: { name }, emailRedirectTo: redirectTo } });
        if (error) throw error;
        if (data.session) { ++revision; apply(data.session, 'SIGNED_IN'); }
        return !!data.session;
      },
      async signOut() {
        const { error } = await client.auth.signOut();
        if (error) throw error;
        ++revision;
        apply(null, 'SIGNED_OUT');
      },
      async resetPassword(email, redirectTo) {
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw error;
      },
      async updateEmail(email, redirectTo) {
        const owner = current?.user?.id;
        if (!owner) throw new Error('Please sign in again.');
        const { data, error } = await client.auth.updateUser({ email }, { emailRedirectTo: redirectTo });
        if (error) throw error;
        if (current?.user?.id !== owner) throw new Error('The signed-in account changed.');
        if (!data?.user || data.user.id !== owner) throw new Error('The email change could not be confirmed. Please try again.');
        ++revision;
        apply({ ...current, user: data.user }, 'USER_UPDATED');
        return data.user;
      },
      async updateName(name) {
        const owner = current?.user?.id;
        if (!owner) throw new Error('Please sign in again.');
        const { data, error } = await client.auth.updateUser({ data: { name } });
        if (error) throw error;
        if (current?.user?.id !== owner) throw new Error('The signed-in account changed.');
        if (!data?.user || data.user.id !== owner) throw new Error('The username could not be confirmed. Please try again.');
        ++revision;
        apply({ ...current, user: data.user }, 'USER_UPDATED');
        return data.user;
      },
      async updatePassword(password) {
        const owner = current?.user?.id;
        if (!owner) throw new Error('Please sign in again.');
        const { data, error } = await client.auth.updateUser({ password });
        if (error) throw error;
        if (current?.user?.id !== owner) throw new Error('The signed-in account changed.');
        ++revision;
        recovery = false;
        apply(data?.user ? { ...current, user: data.user } : current, 'PASSWORD_UPDATED');
      },
      async resend(email, redirectTo) {
        const { error } = await client.auth.resend({ type: 'signup', email,
          options: { emailRedirectTo: redirectTo } });
        if (error) throw error;
      },
      stop() { ++revision; subscription?.unsubscribe(); }
    };
  }
  if (typeof module === 'object' && module.exports) module.exports = { createAuth };
  else root.MyPantryAuth = { createAuth };
})(typeof window === 'undefined' ? globalThis : window);



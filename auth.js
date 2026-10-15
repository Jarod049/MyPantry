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
      async updatePassword(password) {
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        ++revision;
        recovery = false;
        apply(current, 'PASSWORD_UPDATED');
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

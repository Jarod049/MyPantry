# Pantry Pal AI chat

The connected homepage calls the `pantry-chat` Supabase Edge Function. Demo mode keeps the scripted prototype. The AI reads the signed-in user's pantry and supports the last ten conversation messages. It cannot change inventory. Starting a new chat or changing accounts clears conversation context.

Backend setup:
1. Apply `supabase/chat_quota.sql` once (already applied to MyPantry).
2. Set `OPENAI_API_KEY` in Supabase > Edge Functions > Secrets. Never put it in GitHub or browser configuration. API billing must be active on the OpenAI project.
3. Optionally set `OPENAI_MODEL`; the default is `gpt-6-luna`.
4. Deploy `supabase/functions/pantry-chat/index.ts`. It verifies tokens via Auth itself, so deploy with gateway `verify_jwt=false` to support modern signing keys. This does not make chat anonymous: missing/invalid tokens are rejected by the handler.
5. Merge the frontend change to deploy through the existing GitHub Pages workflow.

Requests are limited atomically to 30 per user per UTC hour. Failed model requests after quota consumption count toward this limit. The counter stores only the current hour and count per user. Conversations stay in tab memory. OpenAI requests use `store:false`; this does not replace OpenAI's other applicable data retention policies. Pantry data and recent conversation are sent to OpenAI for each answer. The function allows the production GitHub Pages origin. Local or alternative-host previews need their origin added to CORS before browser testing.

Validation: run `npm test`. Live acceptance: sign in, ask about an actual ingredient, ask a follow-up, start a new chat, then switch accounts and verify pantry isolation. Confirm AI output is plain text and errors do not leave Send disabled. A real end-to-end model test requires the backend API secret and a signed-in website session.

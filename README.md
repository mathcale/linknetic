# Linknetic

## Running locally

### Prerequisites

- [Docker](https://docs.docker.com/engine/install/);
- [Supabase CLI](https://supabase.com/docs/guides/resources/supabase-cli);

### Setup

Execute the following commands to setup all the necessary resources:

1. Create a local .env file with `cp .env.example .env`;
2. Log in to the Supabase CLI with `supabase login`;
3. Create Supabase's config file with `cp supabase/config.toml.example supabase/config.toml`;
4. Edit the `supabase/config.toml` file to include the `client_id` and `secret` for each "auth.external" section. You can learn more on how to obtain those values [here](https://supabase.com/docs/guides/auth/social-login);
5. Start all necessary containers with `supabase start`;
6. After the above command finished, copy the "API URL" and "anon key" outputed by it and put them on the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables on the `.env` file, respectively;

### Starting the app

Simply open a terminal window and run `yarn dev` to spin up a local server on port 3000!

import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

// Node.js < 22 lacks native WebSocket; pass ws explicitly for @supabase/realtime-js
export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { realtime: { transport: ws as any } }
);
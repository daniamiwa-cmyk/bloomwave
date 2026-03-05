// Supabase Edge Function: Process Scheduled Check-ins
// Triggered by pg_cron every minute
// Finds due check-ins and sends push notifications

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  try {
    const now = new Date().toISOString();

    // Find all active check-ins that are due
    const { data: dueCheckins, error } = await supabase
      .from('checkins')
      .select(`
        *,
        device_tokens:device_tokens!user_id(expo_push_token)
      `)
      .eq('status', 'active')
      .lte('scheduled_at', now);

    if (error) {
      console.error('Error fetching due check-ins:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!dueCheckins || dueCheckins.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), { status: 200 });
    }

    let processed = 0;

    for (const checkin of dueCheckins) {
      // Send push notification
      if (checkin.send_push && checkin.device_tokens?.length > 0) {
        const tokens = checkin.device_tokens.map(
          (dt: { expo_push_token: string }) => dt.expo_push_token,
        );

        await sendExpoPush(tokens, {
          title: 'Amaia',
          body: checkin.prompt_template
            ? checkin.prompt_template.replace('{{topic}}', checkin.topic)
            : `Hey, how's ${checkin.topic} going?`,
          data: {
            type: 'checkin',
            checkin_id: checkin.id,
            thread_id: checkin.thread_id,
          },
        });
      }

      // Update check-in
      const updates: Record<string, unknown> = {
        times_triggered: checkin.times_triggered + 1,
        last_triggered_at: now,
      };

      if (checkin.frequency === 'once') {
        updates.status = 'completed';
      } else if (checkin.cron_expression) {
        // Calculate next trigger based on frequency
        const nextDate = new Date();
        if (checkin.frequency === 'daily') {
          nextDate.setDate(nextDate.getDate() + 1);
        } else if (checkin.frequency === 'weekly') {
          nextDate.setDate(nextDate.getDate() + 7);
        }
        // Preserve the original time
        const original = new Date(checkin.scheduled_at);
        nextDate.setHours(original.getHours(), original.getMinutes(), 0, 0);
        updates.scheduled_at = nextDate.toISOString();
      }

      await supabase.from('checkins').update(updates).eq('id', checkin.id);
      processed++;
    }

    return new Response(JSON.stringify({ processed }), { status: 200 });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});

async function sendExpoPush(
  tokens: string[],
  notification: { title: string; body: string; data?: Record<string, unknown> },
) {
  try {
    const messages = tokens.map((token) => ({
      to: token,
      sound: 'default',
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    if (!response.ok) {
      console.error('Expo push failed:', await response.text());
    }
  } catch (err) {
    console.error('Failed to send push notification:', err);
  }
}

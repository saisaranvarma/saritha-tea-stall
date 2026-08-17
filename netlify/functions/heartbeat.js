import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(
    supabaseUrl,
    supabaseSecretKey
);

export async function handler(event) {
    try {
        // Only allow POST requests
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({
                    error: 'Method not allowed'
                })
            };
        }

        // Get visitor ID from browser
        const { visitorId } = JSON.parse(event.body);

        if (!visitorId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'visitorId is required'
                })
            };
        }

        // Insert new visitor or update existing visitor
        const { error: upsertError } = await supabase
            .from('active_visitors')
            .upsert(
                {
                    visitor_id: visitorId,
                    last_seen: new Date().toISOString()
                },
                {
                    onConflict: 'visitor_id'
                }
            );

        if (upsertError) {
            throw upsertError;
        }

        // Count visitors active within the last 60 seconds
        const activeSince = new Date(
            Date.now() - 60 * 1000
        ).toISOString();

        const { count, error: countError } = await supabase
            .from('active_visitors')
            .select('*', {
                count: 'exact',
                head: true
            })
            .gte('last_seen', activeSince);

        if (countError) {
            throw countError;
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activeListeners: count
            })
        };

    } catch (error) {
        console.error('Heartbeat error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
}
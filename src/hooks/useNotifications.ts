import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Notification {
    id: string;
    title: string;
    body: string;
    type: 'general' | 'update' | 'alert' | 'promo';
    created_at: string;
    is_active: boolean;
}

const STORAGE_KEY = 'st_read_notifications';

// نحفظ الإشعارات المقروءة في localStorage (بدون حاجة لتسجيل دخول)
function getReadIds(): string[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function markAsRead(ids: string[]) {
    const existing = getReadIds();
    const merged = [...new Set([...existing, ...ids])];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                // Table might not exist yet – fail silently
                console.warn('Notifications fetch error:', error.message);
                setNotifications([]);
                setUnreadCount(0);
                setLoading(false);
                return;
            }

            const items: Notification[] = data ?? [];
            setNotifications(items);

            const readIds = getReadIds();
            const unread = items.filter(n => !readIds.includes(n.id)).length;
            setUnreadCount(unread);
        } catch (err) {
            console.warn('Notifications error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();

        // Realtime subscription
        const channel = supabase
            .channel('notifications-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchNotifications]);

    const markAllRead = useCallback(() => {
        const ids = notifications.map(n => n.id);
        markAsRead(ids);
        setUnreadCount(0);
    }, [notifications]);

    const markOneRead = useCallback((id: string) => {
        markAsRead([id]);
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    return { notifications, unreadCount, loading, markAllRead, markOneRead, refetch: fetchNotifications };
}

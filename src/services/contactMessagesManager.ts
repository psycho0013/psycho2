import { supabase } from '@/lib/supabase';

export interface ContactMessage {
    id: string;
    created_at: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
}

export interface NewContactMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
}

class ContactMessagesManager {
    /**
     * حفظ رسالة جديدة من نموذج اتصل بنا
     */
    static async saveMessage(data: NewContactMessage): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert({
                    name: data.name,
                    email: data.email,
                    subject: data.subject,
                    message: data.message,
                    is_read: false
                });

            if (error) throw error;

            window.dispatchEvent(new Event('messages-updated'));
            return { success: true };
        } catch (error: any) {
            console.error('Error saving contact message:', error);
            return { success: false, error: error.message || 'حدث خطأ أثناء إرسال الرسالة' };
        }
    }

    /**
     * جلب جميع الرسائل مرتبة من الأحدث للأقدم
     */
    static async getMessages(): Promise<ContactMessage[]> {
        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    }

    /**
     * تحديد رسالة كمقروءة أو غير مقروءة
     */
    static async markAsRead(id: string, isRead: boolean = true): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('contact_messages')
                .update({ is_read: isRead })
                .eq('id', id);

            if (error) throw error;

            window.dispatchEvent(new Event('messages-updated'));
            return true;
        } catch (error) {
            console.error('Error updating message:', error);
            return false;
        }
    }

    /**
     * حذف رسالة
     */
    static async deleteMessage(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', id);

            if (error) throw error;

            window.dispatchEvent(new Event('messages-updated'));
            return true;
        } catch (error) {
            console.error('Error deleting message:', error);
            return false;
        }
    }

    /**
     * جلب عدد الرسائل غير المقروءة
     */
    static async getUnreadCount(): Promise<number> {
        try {
            const { count, error } = await supabase
                .from('contact_messages')
                .select('*', { count: 'exact', head: true })
                .eq('is_read', false);

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    }
}

export default ContactMessagesManager;

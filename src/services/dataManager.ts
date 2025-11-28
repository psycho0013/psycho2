import { supabase } from '@/lib/supabase';
import { homeContent } from '@/data/content/home';
import { aboutContent } from '@/data/content/about';
import { contactContent } from '@/data/content/contact';

export interface SiteContent {
    home: typeof homeContent;
    about: typeof aboutContent;
    contact: typeof contactContent;
}

const defaultContent: SiteContent = {
    home: homeContent,
    about: aboutContent,
    contact: contactContent
};

class DataManager {
    static async getContent(): Promise<SiteContent> {
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('content')
                .eq('id', 'about')
                .single();

            if (error) {
                // If not found (first run) or error, return default
                // We log error but return default to prevent crash
                if (error.code !== 'PGRST116') {
                    console.warn('Supabase fetch error:', error);
                }
                return defaultContent;
            }

            // Merge the fetched "about" content with the default "home" and "contact"
            // The DB currently only stores "about" content in the 'content' column for id='about'
            // If we later store everything, we'll need to adjust this structure
            return {
                ...defaultContent,
                about: data?.content ? { ...defaultContent.about, ...data.content } : defaultContent.about
            };
        } catch (error) {
            console.error('Error in getContent:', error);
            return defaultContent;
        }
    }

    static async updateContent(newContent: SiteContent): Promise<void> {
        try {
            // We are currently only saving the 'about' section to the DB row with id='about'
            // To support full site content saving, we should probably rethink the schema or save the whole object
            // For now, let's just save the 'about' part as requested previously
            const { error } = await supabase
                .from('site_content')
                .upsert({
                    id: 'about',
                    content: newContent.about,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            window.dispatchEvent(new Event('content-updated'));
        } catch (error) {
            console.error('Error updating content:', error);
            throw error;
        }
    }

    static async resetContent(): Promise<void> {
        await this.updateContent(defaultContent);
    }
}

export default DataManager;

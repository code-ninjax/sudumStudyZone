import { supabase } from "./client";

export interface MaintenanceMode {
    enabled: boolean;
    message: string;
}

/**
 * Get current maintenance status
 */
export async function getMaintenanceMode(): Promise<MaintenanceMode> {
    const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single();

    if (error || !data) {
        return { enabled: false, message: '' };
    }

    return data.value;
}

/**
 * Toggle maintenance mode (Admin only)
 */
export async function setMaintenanceMode(enabled: boolean, message: string = "") {
    const { error } = await supabase
        .from('app_settings')
        .update({
            value: { enabled, message },
            updated_at: new Date().toISOString()
        })
        .eq('key', 'maintenance_mode');

    if (error) {
        console.error("Error setting maintenance mode:", error);
        throw error;
    }
}

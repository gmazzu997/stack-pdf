import magically from 'magically-sdk';
import {useAppStateStore} from '../stores/appStateStore';

/**
 * Service for account management operations
 */
export const accountService = {
    /**
     * Permanently deletes a user account and all associated data
     * @param userId - The user ID to delete
     * @returns Promise<boolean> - true if successful
     */
    async deleteAccount(userId: string): Promise<boolean> {
        // Account deletion disabled - app works without authentication
        console.log('Account deletion is disabled in anonymous mode');
        return false;
    },

    /**
     * Validates user confirmation for account deletion
     * @param confirmationText - The text entered by user
     * @returns boolean - true if confirmation is valid
     */
    validateDeletionConfirmation(confirmationText: string): boolean {
        return confirmationText.trim().toUpperCase() === 'DELETE';
    }
};
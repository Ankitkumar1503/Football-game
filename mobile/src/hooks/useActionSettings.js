import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_ACTIONS = [
    'Pass',
    'Dribble',
    'Shot',
    'Goal',
    'Tackle',
    'Header',
    'Corner Kick',
    'Cross',
    'Free Kick',
    'Penalty Kick'
];

const STORAGE_KEY = 'actionWheelSettings';

export function useActionSettings() {
    const [actions, setActions] = useState(DEFAULT_ACTIONS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved) {
                    setActions(JSON.parse(saved));
                }
            } catch (e) {
                console.error('Error loading action settings:', e);
            } finally {
                setIsLoading(false);
            }
        }
        loadSettings();
    }, []);

    useEffect(() => {
        if (!isLoading) {
             const save = async () => {
                 try {
                     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
                 } catch (e) {
                     console.error('Error saving action settings:', e);
                 }
             };
             save();
        }
    }, [actions, isLoading]);

    const addAction = (name) => {
        if (name && !actions.includes(name)) {
            setActions(prev => [...prev, name]);
            return true;
        }
        return false;
    };

    const removeAction = (name) => {
        setActions(prev => prev.filter(a => a !== name));
    };

    const resetDefaults = () => {
        setActions(DEFAULT_ACTIONS);
    };

    const reorderActions = (newOrder) => {
        setActions(newOrder);
    };

    return {
        actions,
        isLoading,
        addAction,
        removeAction,
        resetDefaults,
        reorderActions
    };
}

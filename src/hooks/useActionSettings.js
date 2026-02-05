import { useState, useEffect } from 'react';

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

export function useActionSettings() {
    // Initialize state from localStorage or defaults
    const [actions, setActions] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('actionWheelSettings');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Error parsing action settings:', e);
                }
            }
        }
        return DEFAULT_ACTIONS;
    });

    // Save to localStorage whenever actions change
    useEffect(() => {
        localStorage.setItem('actionWheelSettings', JSON.stringify(actions));
    }, [actions]);

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
        addAction,
        removeAction,
        resetDefaults,
        reorderActions
    };
}

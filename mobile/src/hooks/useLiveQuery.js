import { useState, useEffect } from 'react';
import { subscribeToDb } from '../lib/db';

export function useLiveQuery(queryFn, deps = []) {
    const [result, setResult] = useState(undefined);

    useEffect(() => {
        let isMounted = true;

        const runQuery = async () => {
            try {
                const data = await queryFn();
                if (isMounted) {
                    setResult(data);
                }
            } catch (err) {
                console.error("useLiveQuery error:", err);
            }
        };

        // Run initially
        runQuery();

        // Subscribe to changes
        const unsubscribe = subscribeToDb(() => {
            runQuery();
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, deps);

    return result;
}

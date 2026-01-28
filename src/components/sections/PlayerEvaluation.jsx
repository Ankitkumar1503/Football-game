import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Trophy } from 'lucide-react';
import { useActiveSession } from '../../hooks/useActiveSession';

const EVALUATION_CATEGORIES = {
    'TECHNIQUE': [
        'Ability to play with both feet', 'Passing', 'Controlling and releasing the ball',
        'Feinting and dribbling', 'Shooting at goal finishing technique', 'Heading',
        'Tackling', 'Playing without the ball'
    ],
    'PHYSICAL ATTRIBUTES': [
        'Strength (Explosiveness)', 'Speed', 'Endurance', 'Suppleness (Mobility)', 'Core Muscles'
    ],
    'TACTICAL AWARENESS / COGNITIVE SKILLS': [
        'Reading the game', 'Attacking play attacking one-on-one',
        'Defensive play defending one-on-one', 'Technique under pressure'
    ],
    'CO-ORDINATION': [
        'Orientation', 'Endurance', 'Rhythm', 'Differentiation', 'Reaction', 'Balance'
    ],
    'MENTAL STRENGTHS': [
        'Concentration', 'Willpower will to win', 'Perseverance', 'Confidence',
        'Willingness to take risks', 'Creativity', 'Aggression'
    ],
    'SOCIAL SKILLS AND ATTRIBUTES': [
        'Communication', 'Behavior positive attitude', 'Charisma / Personality'
    ]
};

export function PlayerEvaluation() {
    const { reflection, updateReflection } = useActiveSession();

    // Local state for ratings
    const [ratings, setRatings] = useState({});

    // Sync with database
    useEffect(() => {
        if (reflection && reflection.detailedEvaluation) {
            setRatings(reflection.detailedEvaluation);
        }
    }, [reflection]);

    const handleRatingChange = async (category, skill, rating) => {
        const newRatings = {
            ...ratings,
            [category]: {
                ...(ratings[category] || {}),
                [skill]: rating
            }
        };
        setRatings(newRatings);

        // Save to database
        await updateReflection({
            detailedEvaluation: newRatings
        });
    };

    return (
        <Card className="mb-6 bg-white dark:bg-[#1A1A1A] border-none shadow-none">
            <CardContent className="p-0">
                <div className="flex items-center gap-2 mb-4 border-b-4 border-black dark:border-white pb-2">
                    <h2 className="text-2xl font-black uppercase text-black dark:text-white">PLAYER EVALUATIONS</h2>
                </div>

                <div className="bg-[#E5E5E5] p-2 mb-4">
                    <p className="text-xs font-black uppercase text-gray-600">PLAYER EVALUATION BY:</p>
                    {/* Placeholder for coach name if needed */}
                    <div className="h-6 bg-white w-full mt-1"></div>
                </div>

                <div className="flex justify-between items-center text-[10px] sm:text-xs font-black uppercase mb-2 px-1">
                    <span>EVALUATION:</span>
                    <div className="flex gap-4">
                        <span>1 : VERY GOOD</span>
                        <span>2 : GOOD</span>
                        <span>3 : AVERAGE</span>
                        <span>4 : POOR</span>
                    </div>
                </div>

                {/* Header Row for Grid */}
                <div className="grid grid-cols-[1fr_repeat(4,30px)] gap-1 mb-2 px-1">
                    <div></div>
                    <div className="text-center font-bold text-xs border border-black/20">1</div>
                    <div className="text-center font-bold text-xs border border-black/20">2</div>
                    <div className="text-center font-bold text-xs border border-black/20">3</div>
                    <div className="text-center font-bold text-xs border border-black/20">4</div>
                </div>

                <div className="space-y-6">
                    {Object.entries(EVALUATION_CATEGORIES).map(([category, skills]) => (
                        <div key={category}>
                            <h3 className="text-sm font-black uppercase mb-1 px-1 border-b-2 border-black/10 dark:text-gray-200">{category}</h3>
                            <div className="space-y-[1px]">
                                {skills.map((skill) => {
                                    const currentRating = ratings[category]?.[skill];
                                    return (
                                        <div key={skill} className="grid grid-cols-[1fr_repeat(4,30px)] gap-1 items-center bg-white dark:bg-[#202020] p-1">
                                            <span className="text-[10px] md:text-xs font-bold uppercase text-gray-800 dark:text-gray-300 leading-tight pr-2">{skill}</span>
                                            {[1, 2, 3, 4].map((rating) => (
                                                <label key={rating} className="flex justify-center cursor-pointer h-full">
                                                    <input
                                                        type="radio"
                                                        name={`${category}-${skill}`}
                                                        value={rating}
                                                        checked={currentRating === rating}
                                                        onChange={() => handleRatingChange(category, skill, rating)}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="w-5 h-5 rounded-sm border border-gray-300 peer-checked:bg-[#FF4422] peer-checked:border-[#FF4422] transistion-colors"></div>
                                                </label>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

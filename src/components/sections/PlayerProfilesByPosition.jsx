import React from 'react';
import { Card, CardContent } from '../ui/Card';

const POSITION_PROFILES = [
    {
        position: "GOALKEEPER",
        number: "1",
        physical: [
            "SIZE",
            "AGILITY",
            "REACTION",
            "EXPLOSIVE SPEED",
            "JUMPING SKILLS",
            "SUPPLENESS"
        ],
        technical: [
            "SAFE HANDS",
            "GOOD TECHNIQUE ON THE LINE AND IN THE AIR",
            "GOOD SKILLS WITH THE FEET"
        ],
        tactical: [
            "CHOICE OF POSITIONING AND MOVEMENT",
            "ANTICIPATION",
            "GOOD DISTRIBUTION"
        ],
        mental: [
            "PERSONALITY CONFIDENCE",
            "CALMNESS AND A CERTAIN ECCENTRICITY",
            "CONCENTRATION",
            "A CERTAIN ECCENTRIC-ITY"
        ]
    },
    {
        position: "LEFT AND RIGHT-HAND-SIDE DEFENDERS",
        number: "2+3",
        physical: [
            "SPEED-ENDURANCE (AEROBIC AND ANAEROBIC)",
            "EXPLOSIVE SPEED"
        ],
        technical: [
            "DEFENSIVE TECHNIQUE",
            "TACKLING +",
            "SLIDING TACKLES",
            "SKILL AT RECEIVING THE BALL AND GOOD-QUAL.",
            "ITY PASSING",
            "RUNNING WITH THE BALL"
        ],
        tactical: [
            "POSITIONING AND REPOSITIONING",
            "TIMING",
            "INVOLVEMENT IN ATTACKING PLAY",
            "VERSATILITY IN ATTACK"
        ],
        mental: [
            "AGGRESSIVENESS",
            "WILLPOWER AND CONFIDENCE"
        ]
    },
    {
        position: "CENTRAL DEFENDERS",
        number: "4+5",
        physical: [
            "HEIGHT",
            "MUSCULAR POWER AND JUMPING SKILLS",
            "SPEED",
            "MOBILITY"
        ],
        technical: [
            "INTERCEPTION",
            "CONTROL OF THE BALL IN A DUEL SITUATION",
            "HEADING",
            "LONG AND SHORT PASSING"
        ],
        tactical: [
            "ANTICIPATION",
            "POSITIONING",
            "MARKING",
            "COVERING AND SUPPORT PLAY"
        ],
        mental: [
            "LEADERSHIP TEM-PERAMENT DIRECTION CALMNESS",
            "ABILITY TO REMAIN UNRUFFLED",
            "COURAGE"
        ]
    },
    {
        position: "DEFENSIVE MIDFIELDER",
        number: "6",
        physical: [
            "ENDURANCE (AEROBIC)",
            "STRENGTH (IN THE DUEL)",
            "MOBILITY"
        ],
        technical: [
            "DEFENSIVE TECHNIQUE",
            "PASSING",
            "RECEIVING THE BALL AND SPECIFIC CONTROL DRIBBLING THE BALL AWAY FOR DISTRIBUTION UPFIELD"
        ],
        tactical: [
            "POSITIONING AND REPOSITIONING",
            "ANTICIPATION",
            "PRESSING"
        ],
        mental: [
            "FIGHTING QUALITIES",
            "HUMILITY",
            "CO-OPERATION",
            "WILLPOWER"
        ]
    },
    {
        position: "LEFT AND RIGHT-SIDE MIDFIELDER",
        number: "7+8",
        physical: [
            "ENDURANCE (AEROBIC AND ANAEROBIC)",
            "SPEED"
        ],
        technical: [
            "RUNNING WITH THE BALL",
            "DRIBBLING",
            "CROSSING",
            "SHOOTING"
        ],
        tactical: [
            "MOVING BACK TO DEFEND",
            "INVOLVEMENT IN ATTACKS",
            "PRESSING",
            "PLAYING AND WINNING DUELS"
        ],
        mental: [
            "COURAGE AND GENEROSITY OF SPIRIT",
            "WILLPOWER",
            "CONCENTRATION",
            "WILLINGNESS TO TAKE RISKS"
        ]
    },
    {
        position: "ATTACKERS",
        number: "9+11",
        physical: [
            "POWER (IN THE DUEL)",
            "SPEED",
            "LIVELINESS",
            "AGILITY (DEPENDING ON THE TYPE OF PLAYER)"
        ],
        technical: [
            "FINISHING (SHOOTING)",
            "CONTROL",
            "HEADING",
            "DRIBBLING, FEINTING"
        ],
        tactical: [
            "CONSTANT MOVEMENT",
            "CHANGING OF POSITIONS",
            "RUNS INTO SPACE AND DECOY RUNS",
            "FEINTING",
            "TIMING"
        ],
        mental: [
            '"SELFISHNESS"',
            "OPPORTUNISM",
            "TRICKERY",
            "PERSEVERANCE"
        ]
    },
    {
        position: "THE STRATEGIST",
        number: "10",
        physical: [
            "DEPENDING ON THE TYPE OF PLAYER (AND ON THE PLAYING STYLE)"
        ],
        technical: [
            "ABILITY TO RECEIVE AND DEAL WITH THE BALL SKILFULLY",
            "PASSING",
            "DRIBBLING",
            "FINISHING (SHOOTING)"
        ],
        tactical: [
            "A GOOD FOOTBALLING BRAIN",
            "ANTICIPATION",
            "TACTICAL AWARENESS",
            "ABILITY TO LOSE A MARKER"
        ],
        mental: [
            "LEADERSHIP TEMPERAMENT CREATIVE MIND WILLINGNESS TO TAKE RISKS AND ABLE TO THINK CLEARLY CONFIDENCE",
            "CALMNESS"
        ]
    }
];

export function PlayerProfilesByPosition() {
    return (
        <Card className="mb-[24px] bg-white dark:bg-[#1A1A1A] border-none shadow-none">
            <CardContent className="p-2">
                <div className="flex items-center gap-2 mb-4 border-b-2 border-black dark:border-white pb-2">
                    <h2 className="text-2xl font-black uppercase text-black dark:text-white">PLAYER PROFILES BY POSITION</h2>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        {/* Table Header */}
                        <thead>
                            <tr>
                                <th className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-left p-2 border-2 border-black dark:border-white/20 align-top w-[15%]">
                                    POSITION<br />OF THE<br />PLAYER
                                </th>
                                <th className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-left p-2 border-2 border-black dark:border-white/20 align-top w-[21.25%]">
                                    PHYSICAL<br />QUALITIES<br />REQUIRED
                                </th>
                                <th className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-left p-2 border-2 border-black dark:border-white/20 align-top w-[21.25%]">
                                    TECHNICAL<br />QUALITIES<br />REQUIRED
                                </th>
                                <th className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-left p-2 border-2 border-black dark:border-white/20 align-top w-[21.25%]">
                                    TACTICAL<br />QUALITIES<br />REQUIRED
                                </th>
                                <th className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-left p-2 border-2 border-black dark:border-white/20 align-top w-[21.25%]">
                                    MENTAL<br />QUALITIES<br />REQUIRED
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {POSITION_PROFILES.map((profile, index) => (
                                <tr key={index}>
                                    {/* Position Column */}
                                    <td className="border-2 border-black dark:border-white/20 p-[4] align-top bg-white dark:bg-[#1A1A1A]">
                                        <div className="flex flex-col">
                                            <h3 className="text-xs font-black uppercase text-black dark:text-white leading-tight mb-2">
                                                {profile.position}
                                            </h3>
                                            <div className="text-2xl md:text-3xl font-black text-black dark:text-white leading-none">
                                                {profile.number}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Physical Qualities */}
                                    <td className="border-2 border-black dark:border-white/20 p-[4] align-top bg-white dark:bg-[#1A1A1A]">
                                        <ul className="space-y-1">
                                            {profile.physical.map((item, i) => (
                                                <li key={i} className="text-[8px] md:text-[9px] font-bold uppercase text-gray-800 dark:text-gray-300 leading-tight">
                                                    • {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>

                                    {/* Technical Qualities */}
                                    <td className="border-2 border-black dark:border-white/20 p-[4] align-top bg-white dark:bg-[#1A1A1A]">
                                        <ul className="space-y-1">
                                            {profile.technical.map((item, i) => (
                                                <li key={i} className="text-[8px] md:text-[9px] font-bold uppercase text-gray-800 dark:text-gray-300 leading-tight">
                                                    • {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>

                                    {/* Tactical Qualities */}
                                    <td className="border-2 border-black dark:border-white/20 p-[4] align-top bg-white dark:bg-[#1A1A1A]">
                                        <ul className="space-y-1">
                                            {profile.tactical.map((item, i) => (
                                                <li key={i} className="text-[8px] md:text-[9px] font-bold uppercase text-gray-800 dark:text-gray-300 leading-tight">
                                                    • {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>

                                    {/* Mental Qualities */}
                                    <td className="border-2 border-black dark:border-white/20 p-[4] align-top bg-white dark:bg-[#1A1A1A]">
                                        <ul className="space-y-1">
                                            {profile.mental.map((item, i) => (
                                                <li key={i} className="text-[8px] md:text-[9px] font-bold uppercase text-gray-800 dark:text-gray-300 leading-tight">
                                                    • {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
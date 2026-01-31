export type User = {
    id: string;
    name: string;
    company: string;
    role: 'Technician' | 'Admin';
    points: number;
};

export type Manual = {
    id: string;
    title: string;
    model: string;
    manufacturer: string;
    category: string;
    lastOpened: string;
    pageCount: number;
};

export type Thread = {
    id: string;
    title: string;
    author: string;
    date: string;
    tags: string[];
    solved: boolean;
    replies: number;
};

export const MOCK_USER: User = {
    id: 'u1',
    name: 'Alex Field',
    company: 'Global Tech Services',
    role: 'Technician',
    points: 1250,
};

export const MOCK_MANUALS: Manual[] = [
    {
        id: 'm1',
        title: 'VFD-E Series User Manual',
        model: 'VFD-E',
        manufacturer: 'Delta',
        category: 'Drives',
        lastOpened: '2 mins ago',
        pageCount: 240,
    },
    {
        id: 'm2',
        title: 'MicroLogix 1400 Controllers',
        model: '1766-L32BWA',
        manufacturer: 'Allen-Bradley',
        category: 'PLC',
        lastOpened: '1 day ago',
        pageCount: 180,
    },
    {
        id: 'm3',
        title: 'Hydraulic Excavator 320D',
        model: '320D',
        manufacturer: 'CAT',
        category: 'Mechanical',
        lastOpened: '3 days ago',
        pageCount: 450,
    },
];

export const MOCK_THREADS: Thread[] = [
    {
        id: 't1',
        title: 'VFD-E Fault Code ocA',
        author: 'Sarah Jenkins',
        date: '2h ago',
        tags: ['VFD', 'Overcurrent'],
        solved: true,
        replies: 4,
    },
    {
        id: 't2',
        title: 'Wiring diagram for 1766-L32BWA inputs',
        author: 'Mike Ross',
        date: '5h ago',
        tags: ['Wiring', 'PLC'],
        solved: false,
        replies: 1,
    },
];

export const MOCK_AI_RESPONSES: Record<string, { answer: string; citations: string[] }> = {
    default: {
        answer: "Based on the manual, this fault usually indicates an overcurrent condition during acceleration. \n\nCheck the following:\n1. Motor load is too heavy.\n2. Acceleration time is too short.\n3. VFD output is short-circuited.",
        citations: ["Page 45 - Fault Codes", "Page 12 - Specifications"],
    },
    "wiring": {
        answer: "The input wiring for S/S terminals depends on the sink/source selection. \n\nFor Sink Mode (NPN): Connect +24V to S/S. \nFor Source Mode (PNP): Connect 0V to S/S.",
        citations: ["Page 22 - Wiring", "Page 23 - Terminal Layout"],
    }
};

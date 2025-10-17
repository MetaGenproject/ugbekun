

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import data from './preloader-data.json';
import type { LucideIcon } from 'lucide-react';

export type Greeting = {
    text: string;
    lang: string;
    emoji: string;
}

export type Quote = {
    text: string;
    author: string;
    emoji: string;
}

export type Fact = {
    text: string;
    category: string;
    emoji: string;
}

export type Tip = {
    text: string;
    category: string;
    emoji: string;
}

export type ProTip = {
    path: string;
    text: string;
    category: string;
    icon: keyof typeof import('lucide-react');
}

export type PreloaderItem = Greeting | Quote | Fact | Tip | ProTip;

export const preloaderContent: {
    greetings: Greeting[];
    quotes: Quote[];
    facts: Fact[];
    tips: Tip[];
    proTips: ProTip[];
} = data;

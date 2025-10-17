"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { schoolsData as initialSchools, type School } from '@/lib/super-admin-data';
import { countries } from '@/lib/countries';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Users, MapPin, Award, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CoverPattern } from '@/components/smsup/cover-pattern';


function AvatarImageComponent({ school }: { school: School }) {
    const initial = school.name.charAt(0).toUpperCase();

    return (
        <Avatar className="h-14 w-14 rounded-xl bg-background border-2 border-background z-10 shrink-0">
           {school.logoUrl ? (
                <AvatarImage src={school.logoUrl} alt={school.name} />
           ) : (
                <AvatarFallback className="rounded-lg text-primary-foreground text-2xl font-semibold bg-primary">
                    {initial}
                </AvatarFallback>
           )}
        </Avatar>
    )
}

function SchoolCard({ school }: { school: School }) {
    return (
        <Link href={`/schools/${school.id}`} className="block group">
            <Card className="overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                 <div className="h-28 bg-secondary relative">
                    {school.coverImageUrl ? (
                        <Image src={school.coverImageUrl} alt={`${school.name} campus`} fill objectFit="cover" />
                    ) : (
                       <CoverPattern />
                    )}
                     <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <CardContent className="p-4">
                     <div className="flex items-start gap-3 -mt-10">
                        <AvatarImageComponent school={school} />
                        <div className="flex-1 pt-10">
                            <h3 className="font-semibold truncate flex items-center gap-1.5">
                                <span>{school.name}</span>
                                {school.verified && <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3"/>
                                <span>{school.lga}, {school.state}</span>
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-between items-center text-xs text-muted-foreground mt-3 pt-3 border-t">
                        <div className="flex items-center gap-1"><Users className="h-3 w-3"/> {school.students} students</div>
                        <div className="flex items-center gap-1 font-semibold text-amber-500"><Star className="h-3 w-3 fill-current"/> {school.rating}</div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default function SchoolsDirectoryPage() {
    const [schools] = useLocalStorage<School[]>("schools", initialSchools);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('all');
    const [selectedLga, setSelectedLga] = useState('all');
    
    const states = [{ name: "All States", lgas: [] }, ...countries[0].states];
    const lgas = selectedState !== 'all' ? ["All LGAs", ...(states.find(s => s.name === selectedState)?.lgas || [])] : [];

    const filteredSchools = useMemo(() => {
        return schools.filter(school => {
            const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesState = selectedState === 'all' || school.state === selectedState;
            const matchesLga = selectedLga === 'all' || school.lga === selectedLga;
            return matchesSearch && matchesState && matchesLga;
        });
    }, [schools, searchTerm, selectedState, selectedLga]);

    const topRatedSchools = useMemo(() => [...schools].sort((a,b) => b.rating - a.rating).slice(0,3), [schools]);

    return (
        <div className="bg-background py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight">Find Your School</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Discover, follow, and engage with top schools across Nigeria.</p>
                </div>

                <Card className="mt-8 p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by school name..." 
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                            <SelectContent>
                                {states.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                         <Select value={selectedLga} onValueChange={setSelectedLga} disabled={selectedState === 'all'}>
                            <SelectTrigger><SelectValue placeholder="Select LGA" /></SelectTrigger>
                            <SelectContent>
                                {lgas.map(lga => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                <section className="mt-12">
                    <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Award className="text-primary"/> Top Rated Schools</h2>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topRatedSchools.map(school => <SchoolCard key={school.id} school={school} />)}
                    </div>
                </section>

                <section className="mt-12">
                    <h2 className="text-2xl font-semibold tracking-tight">All Schools ({filteredSchools.length})</h2>
                    {filteredSchools.length > 0 ? (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredSchools.map(school => <SchoolCard key={school.id} school={school} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No schools found matching your criteria.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
